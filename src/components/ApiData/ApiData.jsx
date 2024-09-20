// import { useState, useEffect } from "react";
// import axios from "axios";

// function ApiData() {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       console.log("API Key:", import.meta.env.VITE_API_KEY);
//       try {
//         const response = await axios.get(
//           "https://api-football-v1.p.rapidapi.com/v3/fixtures",
//           {
//             headers: {
//               "X-RapidAPI-Key": import.meta.env.VITE_API_KEY,
//               "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
//             },
//           }
//         );
//         console.log("Data fetched:", response.data);
//         setData(response.data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setError(error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error.message}</p>;

//   return (
//     <div>
//       <h1>Football Matches</h1>
//       <ul>
//         {data?.response?.map((match) => (
//           <li key={match.fixture.id}>
//             {match.fixture.date} - {match.teams.home.name} vs{" "}
//             {match.teams.away.name}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default ApiData;

// script that uses stub data below

import { useState, useEffect } from "react";
import axios from "axios";
import leagueStandings from "../../data/leagueStandings.json";
import matchResults from "../../data/matchResults.json";

function ApiData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Environment Mode:", import.meta.env.MODE);

    const fetchData = async () => {
      console.log("API Key:", import.meta.env.VITE_API_KEY);
      try {
        let response;

        if (import.meta.env.MODE === "development") {
          // In development mode, use the stub data
          console.log("Using stub data for development");
          response = {
            data: {
              leagueStandings: leagueStandings, // Use the league standings data
              matchResults: matchResults, // Use the match results data
            },
          };
        } else {
          // Use the real API in production
          response = await axios.get(
            "https://api-football-v1.p.rapidapi.com/v3/fixtures",
            {
              headers: {
                "X-RapidAPI-Key": import.meta.env.VITE_API_KEY,
                "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
              },
            }
          );
        }

        console.log("Data fetched:", response.data);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
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
      <h2>League Standings</h2>
      <ul>
        {data?.leagueStandings?.response?.map((team) => (
          <li key={team.team.id}>
            {team.team.name} - {team.points} points
          </li>
        ))}
      </ul>

      <h2>Match Results</h2>
      <ul>
        {data?.matchResults?.response?.map((match) => (
          <li key={match.fixture.id}>
            {match.fixture.date} - {match.teams.home.name} vs{" "}
            {match.teams.away.name} : {match.goals.home} - {match.goals.away}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ApiData;
