import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Send, 
  MessageSquare,
  Users,
  Phone,
  Video,
  MoreVertical,
  Search,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const ChatView = ({ user, onBack }) => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef(null);
  const queryClient = useQueryClient();

  // Query per ottenere le chat rooms
  const { data: chatRooms, isLoading: roomsLoading } = useQuery({
    queryKey: ['chat-rooms'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chat_rooms')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Query per ottenere i messaggi della room selezionata
  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: ['chat-messages', selectedRoom?.id],
    queryFn: async () => {
      if (!selectedRoom?.id) return [];
      
      const { data, error } = await supabase
        .from('chat_messages')
        .select(`
          *,
          users!inner(name, email)
        `)
        .eq('room_id', selectedRoom.id)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedRoom?.id
  });

  // Mutation per inviare un messaggio
  const sendMessageMutation = useMutation({
    mutationFn: async (params: { roomId: string; message: string }) => {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          room_id: roomId,
          sender_id: user.id,
          message: message,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['chat-messages', selectedRoom?.id]);
      setNewMessage("");
      scrollToBottom();
    },
    onError: (error) => {
      toast.error("Errore nell'invio del messaggio");
      console.error("Error sending message:", error);
    }
  });

  // Mutation per creare una nuova chat room
  const createRoomMutation = useMutation({
    mutationFn: async (params: { name: string; type?: string }) => {
      const { data, error } = await supabase
        .from('chat_rooms')
        .insert({
        name: params.name,
        type: params.type || 'group',
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['chat-rooms']);
      toast.success("Chat creata con successo!");
    },
    onError: (error) => {
      toast.error("Errore nella creazione della chat");
      console.error("Error creating room:", error);
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedRoom) return;
    
    sendMessageMutation.mutate({
      roomId: selectedRoom.id,
      message: newMessage.trim()
    });
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredRooms = chatRooms?.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      {/* Header */}
      <motion.header 
        className="bg-white/10 backdrop-blur-lg border-b border-white/20"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">Chat & Messaggi</h1>
              <p className="text-blue-200">Comunica con gli altri giocatori</p>
            </div>
            {selectedRoom && (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                  <Phone className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                  <Video className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Sidebar delle chat */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="lg:col-span-1"
          >
            <Card className="glass-card border-white/20 h-full flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Chat
                  </CardTitle>
                  <Button
                    onClick={() => createRoomMutation.mutate({ name: `Chat ${Date.now()}` })}
                    size="icon"
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Barra di ricerca */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-4 h-4" />
                  <Input
                    placeholder="Cerca chat..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/10 border-white/30 text-white placeholder:text-blue-200"
                  />
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 overflow-y-auto">
                <div className="space-y-2">
                  {filteredRooms.map((room) => (
                    <motion.div
                      key={room.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        className={`cursor-pointer transition-all duration-200 ${
                          selectedRoom?.id === room.id
                            ? 'bg-white/20 border-white/40'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                        onClick={() => setSelectedRoom(room)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                                {room.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="text-white font-medium truncate">
                                {room.name}
                              </div>
                              <div className="text-blue-200 text-sm">
                                {room.type === 'group' ? 'Gruppo' : 'Chat privata'}
                              </div>
                            </div>
                            {room.type === 'group' && (
                              <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30">
                                <Users className="w-3 h-3 mr-1" />
                                Gruppo
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
                
                {filteredRooms.length === 0 && !roomsLoading && (
                  <div className="text-center text-blue-200 py-8">
                    <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Nessuna chat trovata</p>
                    <p className="text-sm">Crea la tua prima chat!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Area messaggi */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="lg:col-span-2"
          >
            <Card className="glass-card border-white/20 h-full flex flex-col">
              {selectedRoom ? (
                <>
                  {/* Header chat */}
                  <CardHeader className="border-b border-white/20">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                          {selectedRoom.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-white">{selectedRoom.name}</CardTitle>
                        <p className="text-blue-200 text-sm">
                          {selectedRoom.type === 'group' ? 'Chat di gruppo' : 'Chat privata'}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Messaggi */}
                  <CardContent className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-4">
                      <AnimatePresence>
                        {messages?.map((message) => (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className={`flex ${message.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-xs lg:max-w-md ${
                              message.sender_id === user.id
                                ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                                : 'bg-white/10'
                            } rounded-lg p-3`}>
                              {message.sender_id !== user.id && (
                                <div className="text-blue-200 text-xs mb-1 font-medium">
                                  {message.users.name}
                                </div>
                              )}
                              <div className="text-white">{message.message}</div>
                              <div className={`text-xs mt-1 ${
                                message.sender_id === user.id ? 'text-blue-100' : 'text-blue-300'
                              }`}>
                                {formatTime(message.created_at)}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      <div ref={messagesEndRef} />
                    </div>
                  </CardContent>

                  {/* Input messaggio */}
                  <div className="border-t border-white/20 p-4">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                      <Input
                        placeholder="Scrivi un messaggio..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1 bg-white/10 border-white/30 text-white placeholder:text-blue-200"
                        disabled={sendMessageMutation.isLoading}
                      />
                      <Button
                        type="submit"
                        disabled={!newMessage.trim() || sendMessageMutation.isLoading}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center text-blue-200">
                    <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Seleziona una chat
                    </h3>
                    <p>Scegli una conversazione dalla lista per iniziare a chattare</p>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ChatView;