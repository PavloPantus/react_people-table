import React, { useState, useEffect } from 'react';
import { withRouter, useHistory,
  useLocation, useRouteMatch } from 'react-router-dom';
import Person from './Person';
import getDataFromUrl from './api/getDataFromUrl';
import peopleUrl from './api/peopleUrl';

const PeopleTable = () => {
  const match = useRouteMatch();
  const location = useLocation();
  const history = useHistory();

  const params = new URLSearchParams(location.search);
  const [selectedPerson, setSelectedPerson] = useState(
    match.params.person !== undefined
      ? match.params.person.split('-').join(' ') : ''
  );
  const [filterBy, setFilterBy] = useState(
    params.get('query') !== null ? params.get('query') : ''
  );
  const [people, setPeople] = useState([]);
  const [activeSortMethod, setActiveSortMethod] = useState(
    params.get('sortBy') !== null ? params.get('sortBy') : ''
  );

  useEffect(
    () => {
      getDataFromUrl(peopleUrl)
        .then((peopleFromServer) => {
          setPeople(
            peopleFromServer
              .map(
                (person, index) => ({
                  ...person,
                  id: index + 1,
                  age: person.died - person.born,
                  century: Math.ceil(person.died / 100),
                })
              )
          );
        });
    }
    , []
  );

  useEffect(() => {
    setActiveSortMethod(params.get('sortBy'));
  }, [params.toString()]);
  useEffect(() => {
    setSelectedPerson(match.params.person.split('-').join(' '));
  }, [match.params.person]);

  const getSortMethod = (sortBy) => {
    if (sortBy === '') {
      return () => 1;
    }

    if (typeof people[0][sortBy] === 'string') {
      return (a, b) => a[sortBy].localeCompare(b[sortBy]);
    }

    return (a, b) => a[sortBy] - b[sortBy];
  };

  const visiblePeople = [...people]
    .filter(
      person => (person.name + person.mother + person.father)
        .toLowerCase().includes(filterBy)
    );

  if (visiblePeople.length > 0) {
    visiblePeople.sort(getSortMethod(activeSortMethod));
  }

  return (
    <>

      <h1>People table</h1>
      <p>
          number of currently visible people
        {' '}
        {visiblePeople.length}
      </p>
      <input
        placeholder="type for filtering"
        type="text"
        className="input input_search-in-table"
        onClick={() => {
          setFilterBy('');
        }}
        onChange={(event) => {
          params.set('query', event.target.value.trim().toLowerCase());
          if (event.target.value.trim().toLowerCase().length === 0) {
            params.delete('query');
          }

          history.push({
            search: `?${params.toString()}`,
          });
          setFilterBy(event.target.value.trim().toLowerCase());
        }}
      />
      <table className="PeopleTable">
        <thead className="PeopleTable__head">
          <tr className="PeopleTable__row">
            {['id',
              'name',
              'sex',
              'born',
              'died',
              'mother',
              'father',
              'age',
              'century',
            ].map(
              tableHeading => (
                <th
                  key={tableHeading}
                  className="PeopleTable__heading"
                  onClick={() => {
                    if (tableHeading !== 'mother'
                      && tableHeading !== 'father') {
                      params.delete('sortBy');
                      params.append('sortBy', tableHeading);
                      history.push({
                        search: `?${params.toString()}`,
                      });
                      setActiveSortMethod(tableHeading);
                    }
                  }}

                >
                  {tableHeading}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody className="PeopleTable__body">
          {visiblePeople
            .map(
              person => (
                <Person
                  person={person}
                  key={person.id}
                  selectedPerson={selectedPerson}
                  setSelectedPerson={setSelectedPerson}
                />
              )
            )}
        </tbody>
      </table>
    </>
  );
};

export default withRouter(PeopleTable);
