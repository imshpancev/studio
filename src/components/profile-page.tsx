import { useToast } from '@/hooks/use-toast';
import { uploadFile } from '@/services/storageService';
import { updateUserProfile } from '@/services/userService';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Camera } from 'lucide-react';
import React, { useState } from 'react';

function ProfileAvatarUpload({ user, profile, setProfile }) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploading(true);
      try {
        const file = e.target.files[0];
        const downloadURL = await uploadFile(file, `profilePhotos/${user.uid}/${file.name}`);
        await updateUserProfile({ ...profile, avatar: downloadURL });
        setProfile((prev) => ({
          ...prev,
          avatar: downloadURL
        }));
        toast({ title: "Фото профиля обновлено!" });
      } catch (error) {
        toast({ title: "Ошибка загрузки фото", variant: "destructive" });
      }
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mb-4">
      <Avatar className="h-24 w-24">
        <AvatarImage src={profile.avatar} alt={profile.name} />
        <AvatarFallback>{profile.name?.charAt(0)}</AvatarFallback>
      </Avatar>
      <label className="mt-2 flex items-center cursor-pointer">
        <Camera className="mr-2" />
        {uploading ? "Загрузка..." : "Изменить фото"}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarChange}
          disabled={uploading}
        />
      </label>
    </div>
  );
}

// В вашем компоненте профиля вызовите:
// <ProfileAvatarUpload user={user} profile={profile} setProfile={setProfile} />
