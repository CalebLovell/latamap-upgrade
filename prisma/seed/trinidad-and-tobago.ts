import type { LeaderSeed } from '../../src/data/types';
import { leanings } from '../../src/data/types';

export const source = `https://en.wikipedia.org/wiki/List_of_heads_of_state_of_Trinidad_and_Tobago`;

const countryId = 28;

export const trinidadAndTobago: LeaderSeed[] = [
	{
		id: 24000,
		countryId,
		name: `Captaincy General of Venezuela`,
		party: `Kingdom of Spain`,
		leaning: leanings.MONARCHY,
		tookOffice: `1 January 1777`,
		leftOffice: `1 January 1797`,
	},
	{
		id: 24001,
		countryId,
		name: `Colony of Trinidad and Tobago`,
		party: `British Empire`,
		leaning: leanings.MONARCHY,
		tookOffice: `1 January 1797`,
		leftOffice: `31 August 1962`,
	},
	{
		id: 24002,
		countryId,
		name: `Sir Solomon Hochoy`,
		party: `Independent`,
		leaning: leanings.CENTRIST,
		tookOffice: `31 August 1962`,
		leftOffice: `15 September 1972`,
	},
	{
		id: 24003,
		countryId,
		name: `Sir Ellis Clarke`,
		party: `Independent`,
		leaning: leanings.CENTRIST,
		tookOffice: `15 September 1972`,
		leftOffice: `19 March 1987`,
	},
	{
		id: 24004,
		countryId,
		name: `Noor Hassanali`,
		party: `Independent`,
		leaning: leanings.CENTRIST,
		tookOffice: `20 March 1987`,
		leftOffice: `17 March 1997`,
	},
	{
		id: 24005,
		countryId,
		name: `A. N. R. Robinson`,
		party: `People's National Movement, Democratic Action Congress, National Alliance for Reconstruction`,
		leaning: leanings.CENTRIST,
		tookOffice: `18 March 1997`,
		leftOffice: `16 March 2003`,
	},
	{
		id: 24006,
		countryId,
		name: `George Maxwell Richards`,
		party: `Independent`,
		leaning: leanings.CENTRIST,
		tookOffice: `17 March 2003`,
		leftOffice: `18 March 2013`,
	},
	{
		id: 24007,
		countryId,
		name: `Anthony Carmona`,
		party: `Independent`,
		leaning: leanings.CENTRIST,
		tookOffice: `18 March 2013`,
		leftOffice: `19 March 2018`,
	},
	{
		id: 24008,
		countryId,
		name: `Paula-Mae Weekes`,
		party: `Independent`,
		leaning: leanings.CENTRIST,
		tookOffice: `19 March 2018`,
		leftOffice: `20 March 2023`,
	},
	{
		id: 24009,
		countryId,
		name: `Christine Kangaloo`,
		party: `Independent`,
		leaning: leanings.CENTRIST,
		tookOffice: `20 March 2023`,
		leftOffice: null,
	},
];
