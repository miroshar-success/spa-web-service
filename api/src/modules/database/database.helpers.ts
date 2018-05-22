import Person from '../person/person.schema';
import Fetch from '../fetch/fetch.model';

export async function generatePersons(count = 25) {
  function generate(index, clientName = Math.random() > 0.5 ? "viber" : "telegram") {
    return {
      clientName,
      personKey: { key: index },
      personInfo: { name: `alex${index}`, surname: `mayer${index}`, email: "test@yandex.ru" }
    }
  }

  const persons = [];
  for (let i = 1; i <= count; ++i) {
    persons.push(generate(i));
  }

  Person.insertMany(persons);

}

export async function generateFetchs(count = 25) {
  const stateArray = ['new', 'active', 'failed'];

  function generate(index, state = stateArray[Math.floor(Math.random() * stateArray.length)]) {
    return {
      clientName: 'viber',
      personKey: { "key": index },
      fetchUrl: "http://tut.by",
      createDate: "06-08-2016",
      state,
      selectors: [{ sampleUrl: "http://tut.by/news/1", selector: "div" }],
      selector: "div",
      updateDate: "02-10-2016",
      lastResult: []
    }
  }

  const fetchs = [];
  for (let i = 1; i <= count; ++i) {
    fetchs.push(generate(i));
  }

  Fetch.insertMany(fetchs);
}

export async function removePersons() {
  await Person.remove();
}

export async function remoteFetchs() {
  await Fetch.remove();
}

export async function removeData() {
  await removePersons();
  await remoteFetchs();
}