import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  const [visibleQuery, setVisibleQuery] = useState('');

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
    setSelectedPerson(
      match.params.person !== undefined
        ? match.params.person.split('-').join(' ') : ''
    );
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

  const getFilteredPeople = (peopleToFilter, filterPeopleToFilterBy) => (
    peopleToFilter.filter(
      person => (person.name + person.mother + person.father)
        .toLowerCase().includes(filterPeopleToFilterBy)
    ));

  const visiblePeople = useMemo(() => getFilteredPeople(people, filterBy),
    [filterBy, people]);

  if (visiblePeople.length > 0) {
    visiblePeople.sort(getSortMethod(activeSortMethod));
  }

  const debounce = (callback, delay) => {
    let timer = 0;

    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(callback, delay, ...args);
    };
  };

  const inpuHandler = (inputValue) => {
    params.set('query', inputValue.trim().toLowerCase());
    if (inputValue.trim().toLowerCase().length === 0) {
      params.delete('query');
    }

    history.push({
      search: `?${params.toString()}`,
    });
    setFilterBy(inputValue.trim().toLowerCase());
  };

  const debouncedInputHandler = useCallback(debounce(inpuHandler, 1000), []);

  return (
    <>

      <h1>People table</h1>
      <p>
          number of currently visible people
        {' '}
        {visiblePeople.length}
      </p>
      <input
        value={visibleQuery}
        placeholder="type for filtering"
        type="text"
        className="input input_search-in-table"
        onClick={() => {
          setFilterBy('');
        }}
        onChange={(event) => {
          setVisibleQuery(event.target.value);
          debouncedInputHandler(event.target.value);
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
                />
              )
            )}
        </tbody>
      </table>
    </>
  );
};

export default withRouter(PeopleTable);
