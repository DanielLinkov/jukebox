
export default{
	emits: ['selected','set-queue'],
	props: ['songsInArtist','albums','activeAlbum'],
	data(){
		return {
			list: []
		}
	},
	watch: {
		albums(newVal){
			this.list = [...newVal];
			this.list.sort((a,b) => a.localeCompare(b));
		}
	},
	methods: {
		onSetQueueToAlbum(album){
			const songsInAlbum = this.songsInArtist.filter(song => song.album === album);
			songsInAlbum.sort((a,b) => a.track - b.track);
			this.$emit('set-queue',songsInAlbum,true);
		}
	},
	created(){
	},
	template: /* html */`
		<div>
			<h5>Album</h5>
			<div class="list-group">
				<a class="list-group-item list-group-item-action fw-bold" :class="[ !activeAlbum ? 'active' : '' ]" href="#" @click.prevent="$emit('selected','')">
					All {{ albums.length }} albums ({{ songsInArtist.length }})
				</a>
				<a
					href="#"
					class="list-group-item list-group-item-action"

					v-for="album in list"
					:key="album"
					:class="[ album == activeAlbum ? 'active' : '' ]"
					@click.prevent="$emit('selected',album)"
					@dblclick.prevent="onSetQueueToAlbum(album)"
				>
					{{ album }} ({{ songsInArtist.filter(song => song.album === album).length }})
				</a>
			</div>
		</div>
	`
}