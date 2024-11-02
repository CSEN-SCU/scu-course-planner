// Keep types here, then import them as needed.

export type Course = { 
  name: string; 
  id: string; 
  unit: string 
};

export type UserCourseData = { 
  season: string; 
  year: string; 
  courses: Course[] 
};

export type CourseCardProps = {
  id: string;
  course: Course;
  season: string;
  year: string;
};

export type DroppableQuarterProps = {
  id: string;
  season: string;
  year: string;
  children: React.ReactNode;
};