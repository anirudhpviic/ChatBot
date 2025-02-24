import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.model';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async createUser(nickName: string) {
    const user = await (await this.userModel.create({ nickName })).save();

    return {
      greetings: `Hi ${user.nickName}`,
      introduction: `I'm Jarvis, your quirky companion ready to sprinkle some humor into your day!`,
      user,
    };
  }
}

/*
async sendCompletion(userText: string, userId: string) {
  // Fetch previous chat messages for the user
  const previousChats = await this.chatModel.find({ userId }).sort({ createdAt: 1 }).lean();

  // Convert previous chats into OpenAI's message format
  const chatHistory = previousChats.map(chat => ({
    role: 'user',
    content: chat.userInput,
  }));

  // Add assistant responses to the history
  chatHistory.push(
    ...previousChats.map(chat => ({
      role: 'assistant',
      content: chat.response, // Assuming 'response' is where the assistant's message is stored
    }))
  );

  // Construct the messages array with history + new user input
  const messages = [
    { role: 'system', content: SYSTEM_CONTENT },
    ...chatHistory,
    { role: 'user', content: userText },
  ];

  // Send request to OpenAI with chat history
  const completion = await this.openai.beta.chat.completions.parse({
    model: process.env.OPENAI_MODEL_NAME as string,
    messages,
    store: true,
    response_format: zodResponseFormat(responseFormat, 'response_format'),
  });

  const response_format = completion.choices[0].message;

  if (completion.choices[0].finish_reason === 'length') {
    throw new Error('Incomplete response');
  }

  if (response_format.refusal) {
    throw new Error(response_format.refusal);
  }

  console.log(response_format.parsed);

  // Save chat to database
  const chat = await this.chatModel.create({
    ...response_format.parsed,
    userInput: userText,
    userId,
  });

  return response_format.parsed;
}

*/
