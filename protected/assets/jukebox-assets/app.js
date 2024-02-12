import Songs from './components/songs.js';
import Genres from './components/list-genres.js';

const app = Vue.createApp({
	provide(){
		return {
			allSongs: Vue.computed(() => this.allSongs),	//All songs
			songs: Vue.computed(() => this.songs),	//Filtered songs
		}
	},
	data() {
		return {
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
	created(){
		this.songs = this.allSongs;	//Set filtered songs to all songs
	},
	template: /* html */ `
		<h2 class="text-center">Jukebox</h2>
		<div class="row">
			<div class="col-4">
				<jb-list-genres></jb-list-genres>
			</div>
		</div>
		<jb-songs></jb-songs>
	`
});

app.component('jb-songs', Songs);
app.component('jb-list-genres', Genres);
app.mount('#app');