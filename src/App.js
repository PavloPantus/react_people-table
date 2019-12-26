import React, { useState } from 'react';
import './App.scss';

import peopleUrl from './api/peopleUrl';
import getDataFromUrl from './api/getDataFromUrl';
import PeopleTable from './PeopleTable';

const App = () => {
  const [people, setPeople] = useState([]);

  if (people.length === 0) {
    (async() => {
      const peopleFromServer = await getDataFromUrl(peopleUrl);

      setPeople(
        peopleFromServer.map(
          (person, index) => ({
            ...person, id: index + 1,
          })
        )
      );
    })();
  }

  return (
    <div className="App">
      <h1>People table</h1>
      <p>
        {' '}
number of currently visible people
        {people.length}
      </p>
      <PeopleTable
        people={
          people
            .map(
              person => ({
                ...person,
                age: person.died - person.born,
                century: Math.ceil(person.died / 100),
              })
            )
        }
        setPeople={setPeople}
      />
    </div>
  );
};

export default App;
