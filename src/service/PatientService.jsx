export const PatientService = {
    getPatientsData() {
      return [
        {
          id: "ABC12",
          firstName: "John",
          middleName: "Michael",
          lastName: "Doe",
          gender: "Male",
          age: 35,
          address: "123 Main St, Anytown USA",
          contactNo: "1234567890",
          userName: "jdoe",
          password: "password123",
        },
        {
          id: "DEF34",
          firstName: "Jane",
          middleName: "",
          lastName: "Smith",
          gender: "Female",
          age: 42,
          address: "456 Oak Rd, Someplace USA",
          contactNo: "9876543210",
          userName: "jsmith",
          password: "qwerty",
        },
        {
          id: "GHI56",
          firstName: "Michael",
          middleName: "James",
          lastName: "Johnson",
          gender: "Male",
          age: 28,
          address: "789 Maple Ave, Othertown USA",
          contactNo: "5551234567",
          userName: "mjohnson",
          password: "password!@#",
        },
      ];
    },
    getPatients() {
      return Promise.resolve(this.getPatientsData());
    },
  };
  