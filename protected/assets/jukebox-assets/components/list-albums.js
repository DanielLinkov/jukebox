
export default{
	emits: ['selected'],
	props: ['songsInArtist','albums','activeAlbum'],
	data(){
		return {
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
				<a v-for="album in albums" :key="album" class="list-group-item list-group-item-action" :class="[ album == activeAlbum ? 'active' : '' ]" href="#" @click.prevent="$emit('selected',album)">
					{{ album }} ({{ songsInArtist.filter(song => song.album === album).length }})
				</a>
			</div>
		</div>
	`
}