<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Tag;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $search = $request->input('search');

        $posts = Post::where('title', 'LIKE', "%{$search}%")
        ->orWhere('content', 'LIKE', "%{$search}%")
        ->orWhereHas('tags', function ($query) use ($search) {
          $query->where('name', 'LIKE', "%{$search}%");
        })
        ->orderBy('created_at', 'desc')
        ->paginate(6);

        foreach ($posts as $post) {
          $post->tags = $post->tags()->pluck('name');
        }

        return response()->json($posts, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {

        $request->validate([
          'title' => 'required|string|max:50',
          'content' => 'required|string|min:10|max:255',
          'tags' => 'array',
        ]);

        $tags = [];

        foreach ($request->tags as $tag) {
          $request->validate([
            'tags.name' => 'string|min:1|max:20',
          ]);
          $tags[] = Tag::firstOrCreate(['name' => $tag])->id;
        }

        $post = Post::create($request->all());
        $post->tags()->attach($tags);
        $post->tags = $request->tags;

        return response()->json($post, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Post $post): JsonResponse
    {
        $request->validate([
          'title' => 'required|string|max:50',
          'content' => 'required|string|min:10|max:255',
          'tags' => 'array',
        ]);

        $tags = [];

        foreach ($request->tags as $tag) {
          $request->validate([
            'tags.name' => 'string|min:1|max:20',
          ]);
          $tags[] = Tag::firstOrCreate(['name' => $tag])->id;
        }

        $post->update($request->all());
        $post->tags()->sync($tags);
        $post->tags = $request->tags;

        return response()->json($post, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post): JsonResponse
    {
        $post = Post::findOrFail($post->id);
        $post->tags()->detach();
        $post->delete();

        return response()->json(null, 204);
    }
}
