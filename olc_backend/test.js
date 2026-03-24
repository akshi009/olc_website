import axios from 'axios';

axios.post(`${process.env.NEXT_PUBLIC_BASE}/auth/google`, { code: "test" })
  .then(res => console.log("OK:", res.data))
  .catch(err => {
    console.log("ERR STATUS:", err.response?.status);
    console.log("ERR DATA:", err.response?.data);
    console.log("ERR MSG:", err.message);
  });
