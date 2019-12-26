import React, { useState } from 'react';
import Person from './Person';

const PeopleTable = ({ people, setPeople }) => {
  const [selectedPerson, setSelectedPerson] = useState(0);
  const [filterBy, setFilterBy] = useState('');

  if (people.length > 0) {
    const getSortedPeople = (sortBY, typeOfSortedData) => {
      const getSortMethod = () => {
        if (typeOfSortedData === 'number'
        || typeOfSortedData === 'boolean') {
          return (a, b) => a[sortBY] - b[sortBY];
        }

        if (typeOfSortedData === 'string') {
          return (a, b) => a[sortBY].localeCompare(b[sortBY]);
        }

        return '';
      };

      return [...people].sort(
        getSortMethod()
      );
    };

    return (
      <>
        <input
          placeholder="type for filtering"
          type="text"
          className="input input_search-in-table"
          onChange={(event) => {
            setFilterBy(event.target.value.toLowerCase());
          }}
        />
        <table className="PeopleTable">
          <thead className="PeopleTable__head">
            <tr className="PeopleTable__row">
              <th
                onClick={() => {
                  setPeople(getSortedPeople('id', 'number'));
                }}
                className="PeopleTable__heading"
              >
              id
              </th>
              <th
                onClick={() => {
                  setPeople(getSortedPeople('name', 'string'));
                }}
                className="PeopleTable__heading"
              >
              name
              </th>
              <th
                onClick={() => {
                  setPeople(getSortedPeople('sex', 'string'));
                }}
                className="PeopleTable__heading"
              >
              sex
              </th>
              <th
                onClick={() => {
                  setPeople(getSortedPeople('born', 'number'));
                }}
                className="PeopleTable__heading"
              >
              born
              </th>
              <th
                onClick={() => {
                  setPeople(getSortedPeople('died', 'number'));
                }}
                className="PeopleTable__heading"
              >
              died
              </th>
              <th className="PeopleTable__heading">mother</th>
              <th className="PeopleTable__heading">father</th>
              <th
                onClick={() => {
                  setPeople(getSortedPeople('age', 'number'));
                }}
                className="PeopleTable__heading"
              >
              age
              </th>
              <th
                onClick={() => {
                  setPeople(getSortedPeople('century', 'number'));
                }}
                className="PeopleTable__heading"
              >
century
              </th>
            </tr>
          </thead>
          <tbody className="PeopleTable__body">
            {people
              .filter(
                person => (person.name + person.mother + person.father)
                  .toLowerCase().includes(filterBy)
              )
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
  }

  return '';
};

export default PeopleTable;
