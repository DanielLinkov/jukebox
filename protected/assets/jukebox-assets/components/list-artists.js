
export default{
	emits: ['selected','set-queue'],
	props: ['songsInGenre','artists','activeArtist'],
	data(){
		return {
			list: []
		}
	},
	watch: {
		artists(newVal){
			this.list = [...newVal];
			this.list.sort((a,b) => a.localeCompare(b));
		}
	},
	methods: {
		onSetQueueToArtist(artist){
			const songsInArtist = artist !== null ? this.songsInGenre.filter(song => song.artist === artist) : this.songsInGenre;
			songsInArtist.sort((a,b) => {
				if(a.album != b.album)
					return a.album.localeCompare(b.album);
				return a.track - b.track
			});
			if(songsInArtist.length > 0)
				this.$emit('set-queue',songsInArtist,songsInArtist[0].id);
		}
	},
	created(){
	},
	template: /* html */`
		<div>
			<h5>Artist</h5>
			<div class="list-group artist-list">
				<a
					v-if="artists.length > 1"
					class="list-group-item list-group-item-action fw-bold"
					:class="[ !activeArtist ? 'active' : '' ]"
					@click.prevent="$emit('selected','')"
					@dblclick.prevent="onSetQueueToArtist(null)"
					href="#"
				>
					All {{ artists.length }} artists ({{ songsInGenre.length }})
				</a>
				<a
					v-for="artist in list"
					:key="artist"
					href="#"
					class="list-group-item list-group-item-action"
					:class="[ artist == activeArtist ? 'active' : '' ]"
					@click.prevent="$emit('selected',artist)"
					@dblclick.prevent="onSetQueueToArtist(artist)"
				>
					{{ artist }} ({{ songsInGenre.filter(song => song.artist === artist).length }})
				</a>
			</div>
		</div>
	`
}