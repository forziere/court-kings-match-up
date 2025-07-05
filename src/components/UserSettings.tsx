import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User, Camera, Edit3, Clock, MapPin, Trophy, Users2, Bell, Hand, Gamepad2 } from "lucide-react";

interface UserSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

const UserSettings = ({ isOpen, onClose, user }: UserSettingsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    userEmoji: '😊',
    profilePhotoUrl: '',
    preferredHand: 'Destro',
    preferredPosition: 'Destra', 
    preferredMatchType: 'Amichevole',
    preferredTime: 'Sera',
    sport: user?.sport || '',
    level: user?.level || '',
    city: user?.city || ''
  });
  
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Emoji divertenti per la selezione
  const funEmojis = [
    '😊', '😎', '🤩', '😋', '🤗', '😄', '🥳', '😸', '🤖', '🦸',
    '🎯', '🏆', '⚡', '🔥', '💪', '🎮', '🎵', '🌟', '🚀', '💎',
    '🦄', '🌈', '⭐', '🎪', '🎭', '🎨', '🎸', '🎤', '🎲', '🎊'
  ];

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setProfileData(prev => ({
          ...prev,
          userEmoji: data.user_emoji || '😊',
          profilePhotoUrl: data.profile_photo_url || '',
          preferredHand: data.preferred_hand || 'Destro',
          preferredPosition: data.preferred_position || 'Destra',
          preferredMatchType: data.preferred_match_type || 'Amichevole'
        }));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        toast.error('Il file deve essere inferiore a 5MB');
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      setProfileData(prev => ({
        ...prev,
        profilePhotoUrl: data.publicUrl
      }));

      toast.success('Foto caricata con successo!');
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Errore nel caricamento della foto');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      // Aggiorna profilo utente
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: profileData.name,
          sport: profileData.sport,
          level: profileData.level,
          city: profileData.city
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Aggiorna user_stats
      const { error: statsError } = await supabase
        .from('user_stats')
        .upsert({
          user_id: user.id,
          user_emoji: profileData.userEmoji,
          profile_photo_url: profileData.profilePhotoUrl,
          preferred_hand: profileData.preferredHand,
          preferred_position: profileData.preferredPosition,
          preferred_match_type: profileData.preferredMatchType
        });

      if (statsError) throw statsError;

      toast.success("Profilo aggiornato con successo!");
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error("Errore nel salvataggio del profilo");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700">
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-700">
          <DialogTitle className="text-white text-xl font-bold">Profilo</DialogTitle>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-slate-400" />
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant="ghost"
              size="sm"
              className="text-blue-400 hover:text-blue-300"
            >
              {isEditing ? 'Annulla' : 'Modifica'}
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Photo + Name Section */}
          <div className="flex items-center gap-4 p-4 bg-slate-800 rounded-xl">
            <div className="relative">
              <Avatar className="w-16 h-16">
                <AvatarImage src={profileData.profilePhotoUrl} />
                <AvatarFallback className="text-2xl bg-slate-700">
                  {profileData.userEmoji}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  size="sm"
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700"
                  disabled={uploading}
                >
                  <Camera className="w-4 h-4" />
                </Button>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {isEditing ? (
                  <Input
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({...prev, name: e.target.value}))}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                ) : (
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <span>{profileData.userEmoji}</span>
                    {profileData.name}
                  </h2>
                )}
                {isEditing && (
                  <Button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    variant="outline"
                    size="sm"
                    className="border-slate-600 text-slate-300"
                  >
                    {profileData.userEmoji}
                  </Button>
                )}
              </div>
              
              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div className="mt-2 p-3 bg-slate-700 rounded-lg grid grid-cols-6 gap-2 max-h-32 overflow-y-auto">
                  {funEmojis.map((emoji) => (
                    <Button
                      key={emoji}
                      onClick={() => {
                        setProfileData(prev => ({...prev, userEmoji: emoji}));
                        setShowEmojiPicker(false);
                      }}
                      variant="ghost"
                      size="sm"
                      className="w-8 h-8 text-lg hover:bg-slate-600"
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Preferenze del giocatore */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Preferenze del giocatore</h3>
            
            <div className="space-y-4">
              {/* Mano preferita */}
              <div className="flex items-center justify-between p-4 bg-slate-800 rounded-xl">
                <div className="flex items-center gap-3">
                  <Hand className="w-6 h-6 text-yellow-400" />
                  <div>
                    <p className="text-white font-medium">Mano preferita</p>
                    <p className="text-slate-400 text-sm">
                      {isEditing ? (
                        <Select onValueChange={(value) => setProfileData(prev => ({...prev, preferredHand: value}))}>
                          <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white">
                            <SelectValue placeholder={profileData.preferredHand} />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-600">
                            <SelectItem value="Destro">Destro</SelectItem>
                            <SelectItem value="Sinistro">Sinistro</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        profileData.preferredHand
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Posizione in campo */}
              <div className="flex items-center justify-between p-4 bg-slate-800 rounded-xl">
                <div className="flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-red-400" />
                  <div>
                    <p className="text-white font-medium">Posizione in campo</p>
                    <p className="text-slate-400 text-sm">
                      {isEditing ? (
                        <Select onValueChange={(value) => setProfileData(prev => ({...prev, preferredPosition: value}))}>
                          <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white">
                            <SelectValue placeholder={profileData.preferredPosition} />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-600">
                            <SelectItem value="Destra">Destra</SelectItem>
                            <SelectItem value="Sinistra">Sinistra</SelectItem>
                            <SelectItem value="Centro">Centro</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        profileData.preferredPosition
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tipo di partita */}
              <div className="flex items-center justify-between p-4 bg-slate-800 rounded-xl">
                <div className="flex items-center gap-3">
                  <Trophy className="w-6 h-6 text-purple-400" />
                  <div>
                    <p className="text-white font-medium">Tipo di partita</p>
                    <p className="text-slate-400 text-sm">
                      {isEditing ? (
                        <Select onValueChange={(value) => setProfileData(prev => ({...prev, preferredMatchType: value}))}>
                          <SelectTrigger className="w-40 bg-slate-700 border-slate-600 text-white">
                            <SelectValue placeholder={profileData.preferredMatchType} />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-600">
                            <SelectItem value="Amichevole">Amichevole</SelectItem>
                            <SelectItem value="Competitiva">Competitiva</SelectItem>
                            <SelectItem value="Entrambe">Entrambe</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        profileData.preferredMatchType
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Orario di gioco preferito */}
              <div className="flex items-center justify-between p-4 bg-slate-800 rounded-xl">
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-orange-400" />
                  <div>
                    <p className="text-white font-medium">Orario di gioco preferito</p>
                    <p className="text-slate-400 text-sm">
                      {isEditing ? (
                        <Select onValueChange={(value) => setProfileData(prev => ({...prev, preferredTime: value}))}>
                          <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white">
                            <SelectValue placeholder={profileData.preferredTime} />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-600">
                            <SelectItem value="Mattina">Mattina</SelectItem>
                            <SelectItem value="Pomeriggio">Pomeriggio</SelectItem>
                            <SelectItem value="Sera">Sera</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className="flex items-center gap-1">
                          🌅 {profileData.preferredTime}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                {!isEditing && (
                  <Button variant="ghost" size="sm" className="text-slate-400">
                    <Edit3 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Persone con cui gioca di più */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Persone con cui gioca di più</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800 rounded-xl p-4 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <Users2 className="w-6 h-6 text-white" />
                </div>
                <p className="text-white text-sm">Partner frequenti</p>
                <p className="text-slate-400 text-xs">Aggiungi amici</p>
              </div>
              <div className="bg-slate-800 rounded-xl p-4 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <Gamepad2 className="w-6 h-6 text-white" />
                </div>
                <p className="text-white text-sm">Team</p>
                <p className="text-slate-400 text-xs">Crea squadra</p>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        {isEditing && (
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-700">
            <Button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Salva modifiche
            </Button>
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          className="hidden"
        />
      </DialogContent>
    </Dialog>
  );
};

export default UserSettings;