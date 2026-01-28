import axiosClient from "./axiosClient";

export interface Conversation {
  id: number;
}

export const getLearnerConversation = async (): Promise<Conversation> => {
  const res = await axiosClient.get("/chat/conversation/learner");
  return res as unknown as Conversation;
};

export const getMentorConversation = async (
  learnerId: number
): Promise<Conversation> => {
  const res = await axiosClient.get(
    `/chat/conversation/mentor/${learnerId}`
  );
  return res as unknown as Conversation;
};
