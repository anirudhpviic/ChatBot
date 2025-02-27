import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import {
  moodResponseFormat,
  summaryAndColorResponseFormat,
} from './formats/response.format';
import {
  STREAM_LAYOUT,
  SYSTEM_CONTENT_GET_JOKES,
  SYSTEM_CONTENT_GET_MOOD,
  SYSTEM_CONTENT_GET_SUMMARY_AND_COLOR,
} from './constants';
import { Chat } from './schemas/chat.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ChatGateway } from './chat.gateway';
import { Color } from './schemas/color.model';

@Injectable()
export class ChatService {
  private openai: OpenAI;
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<Chat>,
    @InjectModel(Color.name) private colorModel: Model<Color>,
    private chatGateway: ChatGateway,
  ) {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async getMood(userText: string) {
    const messages = [
      { role: 'system', content: SYSTEM_CONTENT_GET_MOOD },
      { role: 'user', content: userText },
    ];
    const completion = await this.openai.beta.chat.completions.parse({
      model: process.env.OPENAI_MODEL_NAME as string,
      messages: messages as any,
      store: true,
      response_format: zodResponseFormat(moodResponseFormat, 'response_format'),
    });

    const response_format = completion.choices[0].message;

    if (completion.choices[0].finish_reason === 'length') {
      throw new Error('Incomplete response');
    }

    if (response_format.refusal) {
      throw new Error(response_format.refusal);
    }

    console.log('response_format', response_format.content);
    return response_format.parsed.mood;
  }

  async getSummary(response: string) {
    const messages = [
      { role: 'system', content: SYSTEM_CONTENT_GET_SUMMARY_AND_COLOR },
      { role: 'user', content: response },
    ];
    const completion = await this.openai.beta.chat.completions.parse({
      model: process.env.OPENAI_MODEL_NAME as string,
      messages: messages as any,
      store: true,
      response_format: zodResponseFormat(
        summaryAndColorResponseFormat,
        'response_format',
      ),
    });

    const response_format = completion.choices[0].message;

    if (completion.choices[0].finish_reason === 'length') {
      throw new Error('Incomplete response');
    }

    if (response_format.refusal) {
      throw new Error(response_format.refusal);
    }

    return response_format.parsed;
  }

  async sendCompletion(userText: string, userId: string) {
    const mood = await this.getMood(userText);

    const moodColorPattern = await this.colorModel.findOne({ userId });

    // console.log('moodColorPattern', moodColorPattern.colorPattern);

    const previousChats = await this.chatModel
      .find({ userId, mood })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // previous chat + new user input
    const chatHistory = previousChats.flatMap((chat) => [
      { role: 'user', content: chat.question },
      {
        role: 'assistant',
        content: `userInput: ${chat.question}, response: ${chat.response}, mood: ${chat.mood}`,
      },
    ]);

    const messages = [
      { role: 'system', content: SYSTEM_CONTENT_GET_JOKES },
      ...chatHistory,
      { role: 'user', content: userText },
      { role: 'assistant', content: STREAM_LAYOUT },

      // ...(moodColorPattern
      //   ? [
      //       {
      //         role: 'assistant',
      //         content: `colorPattern: ${moodColorPattern.colorPattern}`,
      //       },
      //     ]
      //   : []),
    ];

    const stream = await this.openai.chat.completions.create({
      model: process.env.OPENAI_MODEL_NAME as string,
      messages: messages as any,
      store: true,
      stream: true,
    });

    let finalResponse = '';

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      finalResponse += content;
      this.chatGateway.server.emit('partialResponse', content);
    }

    console.log('Final response:', finalResponse);

    const { summary, color } = await this.getSummary(finalResponse);

    const res = await this.chatModel.create({
      userId,
      question: userText,
      response: finalResponse,
      summary,
      mood,
    });

    const colorRes = await this.colorModel.findOne({ userId });
    if (colorRes) {
      await this.colorModel.updateOne(
        { userId },
        { colorPattern: { ...colorRes.colorPattern, [mood]: color } },
      );
    } else {
      await this.colorModel.create({ userId, colorPattern: { [mood]: color } });
    }

    console.log('res', res);
    this.chatGateway.server.emit('finalResponse', finalResponse);
  }
}
