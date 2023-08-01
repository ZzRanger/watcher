export type PersonType = {
  id: number;
  name: string;
  parent: string;
  phone_number: string;
};

export type CheckinType = {
  id?: number;
  person: number;
  created_at?: string;
  session: string;
  check_in_time: string;
  check_out_time?: string;
  classroomId: number;
};

export type SessionType = {
  id: number;
  created_at: string;
  name: string;
  classroomIds: number[];
};

export type ClassroomType = {
  id: number;
  created_at: string;
  name: string;
};
