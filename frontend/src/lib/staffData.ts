// frontend/src/lib/staffData.ts

export interface StaffMember {
    name: string
    email: string
    gender: 'Male' | 'Female'
    phone: string
  }
  
  export const staffData: StaffMember[] = [
    {
      name: 'Ahmed Mohamed',
      email: 'ahmed.mohamed@example.com',
      gender: 'Male',
      phone: '+20 100 123 4567',
    },
    {
      name: 'Sara Ali',
      email: 'sara.ali@example.com',
      gender: 'Female',
      phone: '+20 111 234 5678',
    },
    {
      name: 'Mahmoud Ibrahim',
      email: 'mahmoud.ibrahim@example.com',
      gender: 'Male',
      phone: '+20 122 345 6789',
    },
    {
      name: 'Yasmine Fouad',
      email: 'yasmine.fouad@example.com',
      gender: 'Female',
      phone: '+20 109 876 5432',
    },
  ]  