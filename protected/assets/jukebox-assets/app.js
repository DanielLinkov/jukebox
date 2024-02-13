import Songs from './components/songs.js';
import Genres from './components/list-genres.js';
import Artists from './components/list-artists.js';
import Albums from './components/list-albums.js';

const app = Vue.createApp({
	provide(){
		return {
		}
	},
	data() {
		return {
			activeGenre: '',	//Active genre
			activeArtist: '',	//Active artist
			activeAlbum: '',
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
				},
				{
					id: 4,
					title: 'Song 4',
					track: 4,
					artist: 'Artist 3',
					genre: 'Genre 1',
					album: 'Album 3',
					duration: '4:10'
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
		albums(){
			return [...new Set(this.songsInArtist.map(song => song.album))];
		},
		songsInAlbum(){
			return this.songsInArtist.filter(song => !this.activeAlbum || song.album === this.activeAlbum);
		}
	},
	methods: {
		onGenreSelected(genre) {
			this.activeGenre = genre;	//Set active genre
			this.activeArtist = '';	//Reset active artist
		},
		onArtistSelected(artist) {
			this.activeArtist = artist;	//Set active genre
			this.activeAlbum = '';	//Reset active album
		},
		onAlbumSelected(album) {
			this.activeAlbum = album;	//Set active album
		},
		onRescanMedia(){
			this.activeGenre = '';
			this.activeArtist = '';
			this.activeAlbum = '';
			fetch($url_rescan_media)
				.then(response => response.json())
				.then(data => {
					console.log(data.list);
					this.allSongs = data.list;
				});
		}
	},
	created(){
		this.songs = this.allSongs;	//Set filtered songs to all songs
	},
	template: /* html */ `
		<div class="position-absolute">
			<button class="btn btn-sm btn-secondary" title="Process all media files" @click="onRescanMedia"><i class="bi bi-arrow-clockwise"></i></button>
		</div>
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
				<div class="col-md-4">
					<jb-list-album
						:activeAlbum="activeAlbum"
						:albums="albums"
						:songsInArtist="songsInArtist"
						@selected="onAlbumSelected"
					></jb-list-album>
				</div>
			</div>
			<div class="row">
				<div class="col-12">
					<jb-songs
						:songs="songsInAlbum"
					></jb-songs>
				</div>
			</div>
		</div>
	`
});

app.component('jb-songs', Songs);
app.component('jb-list-genres', Genres);
app.component('jb-list-artists', Artists);
app.component('jb-list-album', Albums);
app.mount('#app');