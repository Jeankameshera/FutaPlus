
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Search } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import AppSidebar from '@/components/AppSidebar';

interface Message {
  id: number;
  sender: string;
  text: string;
  timestamp: string;
  isMe: boolean;
}

interface Conversation {
  id: number;
  name: string;
  lastMessage: string;
  avatar: string;
  unread: number;
  messages: Message[];
}

const MessagesScreen = () => {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 1,
      name: 'Prof. Dupont',
      lastMessage: 'Concernant votre projet...',
      avatar: 'PD',
      unread: 1,
      messages: [
        {
          id: 1,
          sender: 'Prof. Dupont',
          text: 'Bonjour Jean, concernant votre dernier devoir...',
          timestamp: '10:30',
          isMe: false
        },
        {
          id: 2,
          sender: 'Moi',
          text: 'Oui professeur, je voulais justement vous en parler',
          timestamp: '10:32',
          isMe: true
        },
        {
          id: 3,
          sender: 'Prof. Dupont',
          text: 'Votre analyse était excellente mais il manquait la conclusion',
          timestamp: '10:35',
          isMe: false
        }
      ]
    },
    {
      id: 2,
      name: 'Administration',
      lastMessage: 'Rappel: Inscriptions...',
      avatar: 'AD',
      unread: 2,
      messages: [
        {
          id: 1,
          sender: 'Administration',
          text: 'Rappel: Les inscriptions pour le prochain semestre commencent lundi',
          timestamp: '09:15',
          isMe: false
        }
      ]
    },
    {
      id: 3,
      name: 'Prof. Martin',
      lastMessage: 'Les notes sont disponibles',
      avatar: 'PM',
      unread: 0,
      messages: [
        {
          id: 1,
          sender: 'Prof. Martin',
          text: 'Les notes de l\'examen sont maintenant disponibles',
          timestamp: 'Hier',
          isMe: false
        },
        {
          id: 2,
          sender: 'Moi',
          text: 'Merci professeur, je vais les consulter',
          timestamp: 'Hier',
          isMe: true
        }
      ]
    }
  ]);

  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(conversations[0]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSend = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    const updatedMessage: Message = {
      id: selectedConversation.messages.length + 1,
      sender: 'Moi',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };

    const updatedConversations = conversations.map(convo => {
      if (convo.id === selectedConversation.id) {
        return {
          ...convo,
          messages: [...convo.messages, updatedMessage],
          lastMessage: newMessage
        };
      }
      return convo;
    });

    setConversations(updatedConversations);
    setSelectedConversation(updatedConversations.find(c => c.id === selectedConversation.id) || null);
    setNewMessage('');
  };

  const filteredConversations = conversations.filter(convo =>
    convo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AppSidebar />
      
      <main className="flex-1">
        <div className="container mx-auto p-4">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden h-[calc(100vh-2rem)]">
            <div className="flex h-full">
              {/* Liste des conversations */}
              <div className="w-1/3 border-r">
                <div className="p-3 border-b">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input 
                      placeholder="Rechercher..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="overflow-y-auto h-[calc(100%-64px)]">
                  {filteredConversations.map((convo) => (
                    <div 
                      key={convo.id}
                      onClick={() => setSelectedConversation(convo)}
                      className={`flex items-center p-3 border-b cursor-pointer hover:bg-gray-50 ${selectedConversation?.id === convo.id ? 'bg-blue-50' : ''}`}
                    >
                      <div className="flex-shrink-0">
                        <Avatar className="bg-blue-600 text-white">
                          <span>{convo.avatar}</span>
                        </Avatar>
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium">{convo.name}</h3>
                          {convo.unread > 0 && (
                            <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {convo.unread}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 truncate">{convo.lastMessage}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Zone de chat */}
              {selectedConversation ? (
                <div className="flex-1 flex flex-col">
                  <div className="p-3 border-b flex items-center">
                    <Avatar className="bg-blue-600 text-white">
                      <span>{selectedConversation.avatar}</span>
                    </Avatar>
                    <h3 className="ml-3 font-medium">{selectedConversation.name}</h3>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {selectedConversation.messages.map((message) => (
                      <div 
                        key={message.id} 
                        className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[70%] rounded-lg p-3 ${
                            message.isMe 
                              ? 'bg-blue-600 text-white rounded-br-none' 
                              : 'bg-gray-100 rounded-bl-none'
                          }`}
                        >
                          <p>{message.text}</p>
                          <div 
                            className={`text-xs mt-1 ${
                              message.isMe ? 'text-blue-100' : 'text-gray-500'
                            }`}
                          >
                            {message.timestamp}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-3 border-t">
                    <div className="flex items-center">
                      <Input 
                        placeholder="Tapez votre message..." 
                        className="flex-1 mr-2"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      />
                      <Button 
                        onClick={handleSend}
                        size="icon"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Send size={18} />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-gray-500">Sélectionnez une conversation</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MessagesScreen;
