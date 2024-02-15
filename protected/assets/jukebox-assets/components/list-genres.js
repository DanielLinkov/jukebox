
export default{
	props: ['genres','activeGenre','allSongs'],
	emits: ['selected'],
	data(){
		return {
			list: []
		}
	},
	watch: {
		genres(newVal){
			this.list = [...newVal];
			this.list.sort((a,b) => a.localeCompare(b));
		}
	},
	created(){
	},
	template: /* html */`
		<div>
			<h5>Genre</h5>
			<div class="list-group">
				<a class="list-group-item list-group-item-action fw-bold" :class="[ !activeGenre ? 'active' : '' ]" href="#" @click.prevent="$emit('selected','')">
					All {{ genres.length }} genres ({{ allSongs.length }})
				</a>
				<a v-for="genre in list" :key="genre" class="list-group-item list-group-item-action" :class="[ genre == activeGenre ? 'active' : '' ]" href="#" @click.prevent="$emit('selected',genre)">
					{{ genre }} ({{ allSongs.filter(song => song.genre === genre).length }})
				</a>
			</div>
		</div>
	`
}