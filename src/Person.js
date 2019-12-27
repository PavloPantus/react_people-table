import React from 'react';
import { useHistory,
  useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

const classNames = require('classnames');

const Person = ({ person, selectedPerson, setSelectedPerson }) => {
  const history = useHistory();
  const location = useLocation();

  return (
    <tr
      /* tabIndex="0" */
      className={
        classNames(
          [{ 'Person--male': person.sex === 'm' },
            { 'Person--female': person.sex === 'f' },
            `Person--lived-in-${person.century}`,
            'Person',
            { 'Person--selected': (
              selectedPerson === person.name.toLowerCase()
            ) },
          ]
        )
      }
      onClick={() => {
        /* console.log(params) */
        history.push({
          pathname: `${person.name.split(' ').join('-').toLowerCase()}`,
          search: location.search,
        });
        setSelectedPerson(person.name.toLowerCase());
      }}
      /* onBlur={()=>{setSelectedPerson(0)}} */
    >

      <td className="PeopleTable__description">{person.id}</td>
      <td className={classNames([{ 'born-before-1650': person.born < 1650 }])}>
        {person.name}
      </td>
      <td className="PeopleTable__description">{person.sex}</td>
      <td className="PeopleTable__description">{person.born}</td>
      <td className="PeopleTable__description">{person.died}</td>
      <td className="PeopleTable__description">{person.mother}</td>
      <td className="PeopleTable__description">{person.father}</td>
      <td className={classNames(
        [{ 'lived-for-65-and-more': person.age >= 65 },
          'PeopleTable__description']
      )}
      >
        {person.age}
      </td>
      <td className={classNames(['PeopleTable__description'])}>
        {person.century}
      </td>
    </tr>
  );
};

Person.propTypes = {
  person: PropTypes.shape({
    id: PropTypes.number.isRequired,
    sex: PropTypes.string.isRequired,
    born: PropTypes.number.isRequired,
    died: PropTypes.number.isRequired,
    mother: PropTypes.string,
    father: PropTypes.string,
    century: PropTypes.number.isRequired,
    age: PropTypes.number.isRequired,
  }).isRequired,
  selectedPerson: PropTypes.string.isRequired,
  setSelectedPerson: PropTypes.func.isRequired,
};

export default Person;
