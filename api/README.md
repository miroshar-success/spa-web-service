
- appy environment (**optional**)

        cp .env.example .env

- install yarn as sudo

        npm install -g yarn

- install dependencies

        yarn install

- set host of db `beagle-mongo`


- set host of queue `beagle-rabbit-mq`


- start db/mq

        docker-compose -f docker-compose-dev-infro.yaml up -d

- start project

        yarn start