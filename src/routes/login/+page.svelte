<script lang="ts">
	import type { ActionData } from './$types';
	import { applyAction, enhance, type SubmitFunction } from '$app/forms';
	import { goto, invalidate } from '$app/navigation';
	import { redirect } from '@sveltejs/kit';

	export let form: ActionData;
	let loading = false;

	const handleSubmit: SubmitFunction = () => {
		loading = true;
		return async ({ result }) => {
			if (result.type === 'redirect') {
				await invalidate('supabase:auth');
				goto(result.location);
			} else {
				await applyAction(result);
			}
			loading = false;
		};
	};
</script>

<div class="flex justify-center align-middle h-full">
	<div class="container w-96 mt-16">
		<h1 class="mb-6">Sign in</h1>
		{#if form?.error}
			<div class="">{form.error}</div>
		{/if}
		<form method="post" use:enhance={handleSubmit}>
			<label for="email" class="label">
				<span>Email</span>
				<input
					id="email"
					name="email"
					value={form?.values?.email ?? ''}
					class="input"
					type="email"
					placeholder="Email"
					required
				/>
			</label>

			<label for="password" class="label mt-3">
				<span>Password</span>
				<input
					id="password"
					name="password"
					class="input"
					type="password"
					placeholder="Password"
					required
				/>
			</label>

			<div class="flex flex-row justify-end mt-3">
				<button disabled={loading} type="submit" class="btn variant-filled-primary">Sign in</button>
			</div>
		</form>

		<div class="mt-6">
			<p class="has-text-centered">
				Don't have an account? <a href="/signup">Sign up</a>
			</p>
		</div>
	</div>
</div>
