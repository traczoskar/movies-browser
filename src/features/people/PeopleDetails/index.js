import { useDispatch, useSelector } from "react-redux";
import { Section } from "../../../common/Section";
import { SectionHeader } from "../../../common/SectionHeader";
import { useDataURL } from "../../../utils/API/useDataURL";
import {
  fetchAdditionalData,
  fetchData,
  selectData,
  selectStatus,
  selectAdditionalData,
} from "../../../utils/API/dataSlice";
import { useEffect } from "react";
import { useAdditionalDataURL } from "../../../utils/API/useAdditionalDataURL";
import { Container } from "../../../common/Container";
import { DetailTile } from "../../../common/Tile";
import { GridWrapper } from "../../../common/GridWrapper/styled";
import { Tile } from "../../../common/Tile";
import { formatRate, formatDate } from "../../../utils/dataFormatFunctions";
import LoadingPage from ".././../../common/LoadingPage";
import ErrorPage from ".././../../common/ErrorPage";

const PeopleDetails = () => {
  const dispatch = useDispatch();
  const dataURL = useDataURL();
  const status = useSelector(selectStatus);
  const additionalDataURL = useAdditionalDataURL();

  useEffect(() => {
    dispatch(fetchData(dataURL));
    dispatch(fetchAdditionalData(additionalDataURL));
  }, [dispatch, dataURL, additionalDataURL]);

  const peopleDetails = useSelector(selectData);

  const additionalPeopleDetails = useSelector(selectAdditionalData);
  const casts = additionalPeopleDetails.cast;
  const crews = additionalPeopleDetails.crew;

  switch (status) {
    case "initial":
      return null;
    case "loading":
      return <LoadingPage />;
    case "error":
      return <ErrorPage />;
    case "success":
      return (
        <>
          <Section>
            <Container>
              {peopleDetails && (
                <DetailTile
                  movieTile={false}
                  posterPath={peopleDetails.profile_path}
                  title={peopleDetails.name}
                  firstData={
                    peopleDetails.birthday
                      ? formatDate(peopleDetails.birthday)
                      : "No date of birth available"
                  }
                  secondData={
                    peopleDetails.place_of_birth ||
                    "No place of birth available"
                  }
                  overview={peopleDetails.biography || "No biography available"}
                />
              )}
            </Container>
          </Section>

          <Section>
            <Container>
              <SectionHeader>
                {casts
                  ? `Movies - cast (${casts.length})`
                  : "Movies - cast (0)"}
              </SectionHeader>
              <GridWrapper>
                {casts
                  ? casts.length > 0 &&
                    casts.map((cast) => (
                      <li key={cast.id}>
                        <Tile
                          movieTile={false}
                          posterPath={cast.poster_path}
                          title={cast.title}
                          subtitle={cast.release_date}
                          role={cast.character}
                          rate={
                            cast.vote_average && formatRate(cast.vote_average)
                          }
                          votes={cast.vote_count}
                          link={`/movies/${cast.id}`}
                        />
                      </li>
                    ))
                  : null}
              </GridWrapper>
            </Container>
          </Section>
          <Section>
            <Container>
              <SectionHeader>
                {crews
                  ? `Movies - crew (${crews.length})`
                  : "Movies - crew (0)"}
              </SectionHeader>
              <GridWrapper>
                {crews
                  ? crews.length > 0 &&
                    crews.map((crew) => (
                      <li key={crew.id}>
                        <Tile
                          movieTile={false}
                          posterPath={crew.poster_path}
                          title={crew.title}
                          subtitle={crew.release_date}
                          role={crew.job}
                          rate={
                            crew.vote_average && formatRate(crew.vote_average)
                          }
                          votes={crew.vote_count}
                          link={`/movies/${crew.id}`}
                        />
                      </li>
                    ))
                  : null}
              </GridWrapper>
            </Container>
          </Section>
        </>
      );
  }
};

export default PeopleDetails;
