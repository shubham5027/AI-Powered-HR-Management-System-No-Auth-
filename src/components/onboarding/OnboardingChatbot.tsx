'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Sparkles, Send, ChevronUp, ChevronDown } from "lucide-react";
// import { geminiPrompt } from "@/lib/geminiClient";
import { getGeminiResponse } from '@/lib/geminiClient';


interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function OnboardingChatbot() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      content: "Hello! I'm your AI onboarding assistant. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // const assistantResponse = await geminiPrompt(input);
      const assistantResponse = await getGeminiResponse(input);


      const responseMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: assistantResponse || "Sorry, I couldn’t fetch a response right now.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, responseMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem communicating with the assistant.",
        variant: "destructive"
      });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      <CollapsibleTrigger asChild>
        <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white cursor-pointer flex justify-between items-center">
          <div className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2" />
            <h3 className="font-medium">Onboarding Assistant</h3>
          </div>
          {isOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="flex flex-col h-96">
          <div className="flex-1 p-3 overflow-y-auto bg-gray-50">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`flex ${msg.role === 'assistant' ? 'flex-row' : 'flex-row-reverse'} items-start max-w-[80%]`}>
                    {msg.role === 'assistant' && (
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback className="bg-blue-500 text-white">AI</AvatarFallback>
                      </Avatar>
                    )}
                    <div className={`rounded-lg p-3 text-sm ${msg.role === 'assistant' ? 'bg-white border border-gray-200' : 'bg-blue-500 text-white'}`}>
                      {msg.content}
                      <div className={`text-xs mt-1 ${msg.role === 'assistant' ? 'text-gray-400' : 'text-blue-100'}`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex flex-row items-start max-w-[80%]">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarFallback className="bg-blue-500 text-white">AI</AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg p-3 bg-white border border-gray-200">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="p-3 border-t">
            <form 
              className="flex items-center space-x-2"
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
            >
              <Input 
                placeholder="Ask a question..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1"
              />
              <Button 
                type="submit"
                size="icon" 
                disabled={!input.trim() || isTyping}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
