export type Database = {
  public: {
    Tables: {
      employees: {
        Row: {
          id: number;
          name: string;
          department: string;
          position: string;
          hire_date: string;
          fingerprint_id: string;
          active_status: string;
          email: string;
          phone: string;
          address: string;
          national_id: string;
        };
      };
      attendance: {
        Row: {
          id: number;
          employee_id: number;
          timestamp: string;
          type: string;
        };
      };
      leave_requests: {
        Row: {
          id: number;
          employee_id: number;
          date_start: string;
          date_end: string;
          type: string;
          status: string;
        };
      };
      devices: {
        Row: {
          id: number;
          name: string;
          type: string;
          status: string;
        };
      };
    };
  };
}; 