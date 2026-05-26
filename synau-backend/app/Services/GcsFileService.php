<?php

namespace App\Services;

use Google\Cloud\Storage\StorageClient;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class GcsFileService
{
    private string $bucketName;

    public function __construct()
    {
        $this->bucketName = env('GCS_BUCKET', 'synau-file-storage-489107');
    }

    public function upload(UploadedFile $file, string $folder): string
    {
        $storage = new StorageClient([
            'projectId' => env('GOOGLE_CLOUD_PROJECT', 'e-45-489107'),
        ]);

        $bucket = $storage->bucket($this->bucketName);

        $extension = $file->getClientOriginalExtension();
        $filename = trim($folder, '/') . '/' . now()->format('YmdHis') . '-' . Str::uuid() . '.' . $extension;

        $bucket->upload(
            fopen($file->getRealPath(), 'r'),
            [
                'name' => $filename,
                'metadata' => [
                    'contentType' => $file->getMimeType(),
                ],
            ]
        );

        return 'https://storage.googleapis.com/' . $this->bucketName . '/' . $filename;
    }
}