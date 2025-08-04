<?php

namespace App\Jobs;

use Spatie\Browsershot\Browsershot;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class GenerateOdontogramImage implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected string $odontogramHtml;
    protected string $imagePath;


    public function __construct(string $odontogramHtml, string $imagePath)
    {
        $this->odontogramHtml = $odontogramHtml;
        $this->imagePath = $imagePath;
    }

    public function handle()
    {
        Browsershot::html($this->odontogramHtml)
            ->windowSize(850, 430)
            ->deviceScaleFactor(3)
            ->save($this->imagePath);
    }
}
