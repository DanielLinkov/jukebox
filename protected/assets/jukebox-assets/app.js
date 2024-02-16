import Songs from './components/songs.js';
import Genres from './components/list-genres.js';
import Artists from './components/list-artists.js';
import Albums from './components/list-albums.js';
import Player from './components/player.js';
import Queue from './components/queue.js';

const app = Vue.createApp({
	provide(){
		return {
			playQueue: Vue.computed(() => this.playQueue)
		}
	},
	data() {
		return {
			activeGenre: '',	//Active genre
			activeArtist: '',	//Active artist
			activeAlbum: '',
			allSongs: [],
			currentSong: null,
			playQueue: [],
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
		async selectGenre(genre) {
			this.activeGenre = genre;	//Set active genre
			await this.$nextTick();
			if(this.artists.length == 1){
				this.selectArtist(this.artists[0]);
			}else{
				this.selectArtist('');
			}
		},
		async selectArtist(artist) {
			this.$refs.queue_overlay.classList.remove('visible');
			this.activeArtist = artist;	//Set active genre
			this.activeAlbum = '';	//Reset active album
			await this.$nextTick();
			this.activeAlbum = this.albums.length == 1 ? this.albums[0] : '';
		},
		onAlbumSelected(album) {
			this.activeAlbum = album;	//Set active album
		},
		onSelectAlbum(album){
			this.$refs.queue_overlay.classList.remove('visible');
			this.activeGenre = '';
			const artist = this.allSongs.find(song => song.album === album)?.artist || '';
			this.activeArtist = this.allSongs.filter(song => song.artist === artist && song.album === album).length == this.allSongs.filter(song => song.album === album).length ? artist : '';
			this.activeAlbum = album;
		},
		onScanMedia(){
			this.activeGenre = '';
			this.activeArtist = '';
			this.activeAlbum = '';
			fetch($url_scan_media)
				.then(response=>{
					if(!response.ok){
						throw new Error('Error scanning media');
					}
				})
				.then(data => {
					this.fetchSongs();
				})
				.catch(error => {
					console.error(error);
				});
		},
		fetchSongs(){
			fetch($url_fetch_songs)
				.then(response => response.json())
				.then(data => {
					this.allSongs = data.songs;
				});
		},
		setPlayQueue(songs, playSongId = null){
			this.playQueue = songs;
			let song = null;
			if(playSongId && (song = songs.find(song => song.id === playSongId))){
				this.$refs.player.play(song.id);
			}
		},
		onPlaying(songId){
			this.currentSong = this.allSongs.find(song => song.id === songId);
		},
		playSong(songId){
			this.$refs.player.play(songId);
		},
		toggleQueue(){
			this.$refs.queue_overlay.classList.toggle('visible');
		}
	},
	created(){
		this.fetchSongs();
	},
	template: /* html */ `
		<div class="position-absolute">
			<button class="btn btn-sm btn-secondary" title="Process all media files" @click="onScanMedia"><i class="bi bi-arrow-clockwise"></i></button>
		</div>
		<h2 class="text-center">Jukebox</h2>
		<div class="container-fluid mb-5 pb-3">
			<div class="row">
				<div class="col-md-4">
					<jb-list-genres
						:activeGenre="activeGenre"
						:genres="genres"
						:allSongs="allSongs"
						@selected="selectGenre"
					></jb-list-genres>
				</div>
				<div class="col-md-4">
					<jb-list-artists
						:activeArtist="activeArtist"
						:artists="artists"
						:songsInGenre="songsInGenre"
						@selected="selectArtist"
						@set-queue="setPlayQueue"
					></jb-list-artists>
				</div>
				<div class="col-md-4">
					<jb-list-album
						:activeAlbum="activeAlbum"
						:albums="albums"
						:songsInArtist="songsInArtist"
						@selected="onAlbumSelected"
						@set-queue="setPlayQueue"
					></jb-list-album>
				</div>
			</div>
			<div class="row">
				<div class="col-12">
					<jb-songs
						:songs="songsInAlbum"
						:currentSong="currentSong"
						@set-queue="setPlayQueue"
					></jb-songs>
				</div>
			</div>
		</div>
		<div class="position-fixed bottom-0 w-100 border-top border-2 border-primary bg-secondary p-2 z-3">
			<jb-player
				ref="player"
				@playing="onPlaying"
				@select-artist="selectArtist"
				@select-album="onSelectAlbum"
				@toggle-queue="toggleQueue"
			></jb-player>
		</div>
		<div id="queue-overlay" class="z-2" ref="queue_overlay">
			<jb-queue
				ref="queue"
				:playQueue="playQueue"
				:currentSong="currentSong"
				@toggle-queue="toggleQueue"
				@play-song="playSong"
			></jb-queue>
		</div>
	`
});

app.component('jb-songs', Songs);
app.component('jb-list-genres', Genres);
app.component('jb-list-artists', Artists);
app.component('jb-list-album', Albums);
app.component('jb-player', Player);
app.component('jb-queue', Queue);
app.mount('#app');