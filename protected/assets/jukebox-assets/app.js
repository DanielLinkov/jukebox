import Songs from './components/songs.js';
import Genres from './components/list-genres.js';
import Artists from './components/list-artists.js';

const app = Vue.createApp({
	provide(){
		return {
		}
	},
	data() {
		return {
			activeGenre: '',	//Active genre
			activeArtist: '',	//Active artist
			songs: [],	//Filtered songs
			allSongs: [	//All songs
				{
					id: 1,
					title: 'Song 1',
					track: 1,
					artist: 'Artist 1',
					genre: 'Genre 1',
					album: 'Album 1',
					duration: '3:00'
				},
				{
					id: 2,
					title: 'Song 2',
					track: 2,
					artist: 'Artist 2',
					genre: 'Genre 2',
					album: 'Album 2',
					duration: '3:30'
				},
				{
					id: 3,
					title: 'Song 3',
					track: 3,
					artist: 'Artist 3',
					genre: 'Genre 1',
					album: 'Album 3',
					duration: '4:00'
				}
			]
		}
	},
	computed: {
		//Get unique genres
		genres() {
			return [...new Set(this.allSongs.map(song => song.genre))];
		},
		songsInGenre() {
			return this.allSongs.filter(song => !this.activeGenre || song.genre === this.activeGenre);
		},
		//Get unique artists
		artists() {
			return [...new Set(this.songsInGenre.map(song => song.artist))];
		},
		songsInArtist() {
			return this.songsInGenre.filter(song => !this.activeArtist || song.artist === this.activeArtist);
		},
	},
	methods: {
		onGenreSelected(genre) {
			this.activeGenre = genre;	//Set active genre
			this.activeArtist = '';	//Reset active artist
		},
		onArtistSelected(artist) {
			this.activeArtist = artist;	//Set active genre
		}
	},
	created(){
		this.songs = this.allSongs;	//Set filtered songs to all songs
	},
	template: /* html */ `
		<h2 class="text-center">Jukebox</h2>
		<div class="container-fluid">
			<div class="row">
				<div class="col-md-4">
					<jb-list-genres
						:activeGenre="activeGenre"
						:genres="genres"
						:allSongs="allSongs"
						@selected="onGenreSelected"
					></jb-list-genres>
				</div>
				<div class="col-md-4">
					<jb-list-artists
						:activeArtist="activeArtist"
						:artists="artists"
						:songsInGenre="songsInGenre"
						@selected="onArtistSelected"
					></jb-list-artists>
				</div>
			</div>
			<div class="row">
				<div class="col-12">
					<jb-songs
						:songs="songsInArtist"
					></jb-songs>
				</div>
			</div>
		</div>
	`
});

app.component('jb-songs', Songs);
app.component('jb-list-genres', Genres);
app.component('jb-list-artists', Artists);
app.mount('#app');