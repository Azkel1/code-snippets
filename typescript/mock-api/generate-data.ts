import { faker } from '@faker-js/faker';
import { writeFile } from 'fs';

const profile = {
    name: faker.name.firstName(),
    surname: faker.name.lastName(),
    age: 32,
    occupation: faker.name.jobTitle()
};

const comments = new Array(30).fill(null).map((e, index) => ({
    id: index + 1,
    author: faker.internet.email(),
    text: faker.lorem.sentences(2),
    date: faker.date.recent(30)
}));

writeFile('./db.json', JSON.stringify({
    profile,
    comments
}), (output) => {
    output ? console.error(output) : console.log('data generated successfully');
});
