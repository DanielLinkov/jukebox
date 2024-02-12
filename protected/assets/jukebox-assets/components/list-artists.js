
export default{
	emits: ['selected'],
	props: ['songsInGenre','artists','activeArtist'],
	data(){
		return {
		}
	},
	created(){
	},
	template: /* html */`
		<div>
			<h5>Artist</h5>
			<div class="list-group">
				<a class="list-group-item list-group-item-action fw-bold" :class="[ !activeArtist ? 'active' : '' ]" href="#" @click="$emit('selected','')">
					All {{ artists.length }} artists ({{ songsInGenre.length }})
				</a>
				<a v-for="artist in artists" :key="artist" class="list-group-item list-group-item-action" :class="[ artist == activeArtist ? 'active' : '' ]" href="#" @click="$emit('selected',artist)">
					{{ artist }} ({{ songsInGenre.filter(song => song.artist === artist).length }})
				</a>
			</div>
		</div>
	`
}