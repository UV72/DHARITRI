import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, User, Bot, Loader2 } from "lucide-react";
import { toast } from "sonner";
 
interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}
 
const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
 
  // Scroll to bottom of chat when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
 
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
 
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);
  };
 
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
 
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
 
    // Generate a unique ID for the message
    const messageId = Date.now().toString();
 
    // Add user message to chat
    const userMessage: ChatMessage = {
      id: messageId,
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };
 
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
 
    try {
      // Send message to backend - fixed URL and request body format
      const response = await fetch("http://localhost:8000/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: inputMessage }),
      });
 
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
 
      const data = await response.json();
 
      // Add bot response to chat
      const botMessage: ChatMessage = {
        id: `bot-${messageId}`,
        content: data.response || "Sorry, I couldn't process your request.",
        sender: "bot",
        timestamp: new Date(),
      };
 
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to get a response. Please try again.");
 
      // Add error message
      const errorMessage: ChatMessage = {
        id: `error-${messageId}`,
        content: "Sorry, I couldn't connect to the server. Please try again later.",
        sender: "bot",
        timestamp: new Date(),
      };
 
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
 
  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      <Card className="flex flex-col h-full">
        <CardHeader>
          <CardTitle>Chat Assistant</CardTitle>
          <CardDescription>
            Ask me any questions about your health and diet
          </CardDescription>
        </CardHeader>
 
        <CardContent className="flex-grow flex flex-col h-full">
          {/* Chat messages container */}
          <div className="flex-grow overflow-y-auto mb-4 p-4 bg-muted/30 rounded-md h-96">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <p>Ask a question to start the conversation</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-3/4 p-3 rounded-lg ${
                        message.sender === "user"
                          ? "bg-health-primary text-white rounded-tr-none"
                          : "bg-health-light border border-health-muted rounded-tl-none"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {message.sender === "user" ? (
                          <User className="w-4 h-4" />
                        ) : (
                          <Bot className="w-4 h-4" />
                        )}
                        <span className="text-xs font-medium">
                          {message.sender === "user" ? "You" : "Assistant"}
                        </span>
                      </div>
                      <div className="whitespace-pre-line">{message.content}</div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
 
          {/* Input area */}
          <div className="flex gap-2 items-end">
            <Textarea
              value={inputMessage}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type your message here..."
              className="resize-none min-h-12 py-3"
              rows={1}
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="bg-health-primary hover:bg-health-secondary h-12"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
 
export default ChatInterface;