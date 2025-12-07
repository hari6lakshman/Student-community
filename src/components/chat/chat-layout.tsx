'use client';

import type { Message, Student, User } from '@/lib/types';
import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { ChatHeader } from './chat-header';
import { ChatMessages } from './chat-messages';
import { ChatInput } from './chat-input';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { addDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection, query, orderBy, serverTimestamp, doc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

interface ChatLayoutProps {
  currentUser: User;
}

export function ChatLayout({ currentUser }: ChatLayoutProps) {
  const firestore = useFirestore();
  const [isUploading, setIsUploading] = useState(false);

  const messagesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'chat_messages'), orderBy('timestamp', 'asc'));
  }, [firestore]);

  const studentsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'students');
  }, [firestore]);

  const { data: messagesData, isLoading: messagesLoading } = useCollection<Message>(messagesQuery);
  const { data: studentsData } = useCollection<Student>(studentsQuery);

  const messagesWithStudentData = useMemo(() => {
    if (!messagesData || !studentsData) return [];
    
    const studentsMap = new Map(studentsData.map(s => [s.id, s]));

    return messagesData.map(msg => ({
      ...msg,
      student: studentsMap.get(msg.studentId),
    }));
  }, [messagesData, studentsData]);


  const sendMessage = (text: string) => {
    if (!firestore) return;
    const messagesCollection = collection(firestore, 'chat_messages');
    addDocumentNonBlocking(messagesCollection, {
      message: text,
      studentId: currentUser.id,
      timestamp: serverTimestamp(),
    });
  };
  
  const sendFile = async (file: File) => {
    if (!firestore) return;
    setIsUploading(true);

    try {
      const storage = getStorage();
      const fileId = uuidv4();
      const storageRef = ref(storage, `uploads/${fileId}-${file.name}`);
      
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      const messagesCollection = collection(firestore, 'chat_messages');
      addDocumentNonBlocking(messagesCollection, {
        message: '',
        studentId: currentUser.id,
        timestamp: serverTimestamp(),
        fileUrl: downloadURL,
        fileName: file.name,
        fileType: file.type,
      });

    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const deleteMessage = (id: string) => {
    if (!firestore) return;
    const messageDoc = doc(firestore, 'chat_messages', id);
    deleteDocumentNonBlocking(messageDoc);
  }

  return (
    <Card className="w-full max-w-4xl h-[85vh] flex flex-col border-2 border-primary shadow-2xl shadow-primary/20 rounded-2xl">
      <ChatHeader />
      <div className="h-px w-full bg-gradient-to-r from-transparent via-primary to-transparent" />
      <ChatMessages
        messages={messagesWithStudentData}
        currentUser={currentUser}
        onDeleteMessage={deleteMessage}
        isLoading={messagesLoading}
      />
      <ChatInput onSendMessage={sendMessage} onSendFile={sendFile} isUploading={isUploading} />
    </Card>
  );
}
