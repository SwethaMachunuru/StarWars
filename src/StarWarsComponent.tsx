import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  styled,
  Button,
  CardMedia,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import logo from "./Star_Wars_Logo.svg";
import "./starWarsStyles.css";

const StyledCard = styled(Card)({
  width: "20%",
  margin: 10,
  fontSize: "10px",
});

interface Character {
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  homeworld: string;
  films: string[];
  species: string[];
  vehicles: string[];
  starships: string[];
  created: string;
  edited: string;
  url: string;
}

interface ApiResponse {
  results: Character[];
  next: string | null;
  previous: string | null;
}

// Defines the number of cards to display per page
const cardsPerPage = 4;

function StarWarsComponent() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [massSortOrder, setMassSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    fetchCharacters(currentPage);
  }, [currentPage]);

  const fetchCharacters = (page: number) => {
    setLoading(true);
    axios
      .get<ApiResponse>(`https://swapi.dev/api/people/?page=${page}`)
      .then((response) => {
        const data: ApiResponse = response.data;
        if (data.results.length === 0) {
          setHasMoreData(false); // No more data available
        } else {
          setCharacters((prevCharacters) => [...prevCharacters, ...data.results]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  };

  const handlePreviousClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setHasMoreData(true);
    }
  };

  const handleNextClick = () => {
    if (characters.length > endIndex) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  // Calculates the index range for the characters to display on the current page
  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;

  // Slice the characters array to display only the characters for the current page
  const charactersToDisplay = characters.slice(startIndex, endIndex);

  const toggleMassSortOrder = () => {
    setMassSortOrder(massSortOrder === "asc" ? "desc" : "asc");
  };

  // Sorts the characters by mass based on the selected sorting order
  const sortedCharactersByMass = charactersToDisplay.slice().sort((a, b) => {
    const massA = parseFloat(a.mass) || 0; // this Parse mass as a float (default to 0 if not a valid number)
    const massB = parseFloat(b.mass) || 0;

    if (massSortOrder === "asc") {
      return massA - massB;
    } else {
      return massB - massA;
    }
  });

  return (
    <div className="App">
      <h1 className="heading">Star Wars Characters</h1>
      {loading ? (
        <CircularProgress />
      ) : (
        <div className="characterList">
          {sortedCharactersByMass.map((character, index) => (
            <StyledCard key={index}>
              <CardMedia
                sx={{ height: 140 }}
                image={logo}
                title="green iguana"
              />
              <CardContent>
                <Typography variant="h5" component="div">
                  {character.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Height:</strong> {character.height}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Mass:</strong> {character.mass}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Hair Color:</strong> {character.hair_color}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Skin Color:</strong> {character.skin_color}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Eye Color:</strong> {character.eye_color}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Birth Year:</strong> {character.birth_year}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Gender:</strong> {character.gender}
                </Typography>
                {character.films.length > 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    <strong>Films:</strong>
                    {character.films?.map((film, filmIndex) => (
                      <div key={filmIndex}>
                        <a
                          href={film}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {film}
                        </a>
                      </div>
                    ))}
                  </Typography>
                ) : (
                  ""
                )}

                {character.species.length > 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    <strong>Species:</strong>
                    {character.species?.map((speciesItem, speciesIndex) => (
                      <div key={speciesIndex}>
                        <a
                          href={speciesItem}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {speciesItem}
                        </a>
                      </div>
                    ))}
                  </Typography>
                ) : (
                  ""
                )}

                {character.vehicles.length > 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    <strong>Vehicles:</strong>
                    {character.vehicles?.map((vehicle, vehicleIndex) => (
                      <div key={vehicleIndex}>
                        <a
                          href={vehicle}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {vehicle}
                        </a>
                      </div>
                    ))}
                  </Typography>
                ) : (
                  ""
                )}

                {character.starships.length > 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    <strong>Starships:</strong>
                    {character.starships.map((starship, starshipIndex) => (
                      <div key={starshipIndex}>
                        <a
                          href={starship}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {starship}
                        </a>
                      </div>
                    ))}
                  </Typography>
                ) : (
                  ""
                )}
              </CardContent>
            </StyledCard>
          ))}
        </div>
      )}

      <div className="pagination">
        <div className="currentPageText">Page {currentPage}</div>
        <div className="buttonContainer">
          <Button
            className="previousButton"
            variant="contained"
            onClick={handlePreviousClick}
            disabled={currentPage === 1}
          >
            Previous
          </Button>

          <Button
            variant="contained"
            onClick={handleNextClick}
            disabled={characters.length <= endIndex}
          >
            Next
          </Button>

          <Button
            className="sortButton"
            variant="contained"
            onClick={toggleMassSortOrder}
          >
            Sort by Mass
          </Button>
        </div>
      </div>
    </div>
  );
}

export default StarWarsComponent;
