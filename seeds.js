use bucket_list;
db.dropDatabase();
use bucket_list;

db.countries.insert([
  {
    name: "Azerbaijan"
  },
  {
    name: "Iran"
  },
  {
    name: "Japan"
  }
]);