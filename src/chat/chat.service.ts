import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import {
  jokesResponseFormat,
  moodResponseFormat,
} from './formats/response.format';
import { SYSTEM_CONTENT_GET_JOKES, SYSTEM_CONTENT_GET_MOOD } from './constants';
import { Chat } from './schemas/chat.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ChatService {
  private openai: OpenAI;
  constructor(@InjectModel(Chat.name) private chatModel: Model<Chat>) {
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

  async sendCompletion(userText: string, userId: string) {
    const mood = await this.getMood(userText);

    const previousChats = await this.chatModel
      .find({ userId, mood })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // previous chat + new user input
    const chatHistory = previousChats.flatMap((chat) => [
      { role: 'user', content: chat.userInput },
      {
        role: 'assistant',
        content: `Mood: ${chat.mood}, Color: ${chat.color}, Jokes: ${chat.jokes.join('\n')}`,
      },
    ]);

    // console.log('chatHistory', ...chatHistory);

    const messages = [
      { role: 'system', content: SYSTEM_CONTENT_GET_JOKES },
      ...chatHistory,
      { role: 'user', content: userText },
    ];

    const completion = await this.openai.beta.chat.completions.parse({
      model: process.env.OPENAI_MODEL_NAME as string,
      messages: messages as any,
      store: true,
      response_format: zodResponseFormat(
        jokesResponseFormat,
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

    await this.chatModel.create({
      ...response_format.parsed,
      userInput: userText,
      userId,
    });

    return response_format.parsed;
  }
}
