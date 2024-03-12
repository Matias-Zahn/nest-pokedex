import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokeResponse } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter,
  ) {}

  //? Insercion de a UNO
  // async executeSeed() {
  //   const { data } = await this.axios.get<PokeResponse>(
  //     'https://pokeapi.co/api/v2/pokemon?limit=10',
  //   );

  //   data.results.forEach(async ({ name, url }) => {
  //     const segments = url.split('/');
  //     const no: number = +segments[segments.length - 2];

  //     await this.pokemonService.create({ name, no });
  //   });

  //   return 'Seed executed, please check the Data Base';
  // }

  //? 2. Utilizando un Promise.all() para resolver todas las promesas que se generan por el ENDPOINT
  // async executeSeed() {
  //   await this.pokemonModel.deleteMany(); // Borrar todos los pokemons

  //   const { data } = await this.axios.get<PokeResponse>(
  //     'https://pokeapi.co/api/v2/pokemon?limit=10',
  //   );

  //   const insertPromises = [];

  //   data.results.forEach(({ name, url }) => {
  //     const segments = url.split('/');
  //     const no: number = +segments[segments.length - 2];

  //     insertPromises.push(this.pokemonModel.create({ name, no }));
  //   });

  //   await Promise.all(insertPromises);

  //   return 'Seed executed, please check the Data Base';
  // }

  //? 3. Utilizando un metodo del ORM

  async executeSeed() {
    await this.pokemonModel.deleteMany(); // Borrar todos los pokemons

    const data = await this.http.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=10',
    );

    const insertPokemons: { name: string; no: number }[] = [];

    data.results.forEach(({ name, url }) => {
      const segments = url.split('/');
      const no: number = +segments[segments.length - 2];

      insertPokemons.push({ name, no });
    });

    await this.pokemonModel.insertMany(insertPokemons);

    return 'Seed executed, please check the Data Base';
  }
}
