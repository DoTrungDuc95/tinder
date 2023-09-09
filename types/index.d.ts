export type SwiperCard = {
  id: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  job: string;
  photo: any;
  age: number;
  gender: 'male' | 'female';
};

export type MatchType = {
  id: string;
  match: string[];
  users: {
    [key: string]: SwiperCard;
  };
};

export type MessageType = {
  id: string;
  userId: string;
  message: string;
};
