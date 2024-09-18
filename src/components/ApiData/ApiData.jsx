import { useState, useEffect } from "react";
import axios from "axios";

function ApiData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      console.log("API Key:", import.meta.env.VITE_API_KEY);
      try {
        const response = await axios.get(
          "https://api-football-v1.p.rapidapi.com/v3/fixtures",
          {
            headers: {
              "X-RapidAPI-Key": import.meta.env.VITE_API_KEY,
              "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
            },
          }
        );
        console.log("Data fetched:", response.data); // Log fetched data
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error); // Log any errors
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Football Matches</h1>
      <ul>
        {data?.response?.map((match) => (
          <li key={match.fixture.id}>
            {match.fixture.date} - {match.teams.home.name} vs{" "}
            {match.teams.away.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ApiData;
