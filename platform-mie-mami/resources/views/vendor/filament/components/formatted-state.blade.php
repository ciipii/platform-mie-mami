@props([
    'state' => null,
    'money' => false,
    'date' => false,
    'dateTime' => false,
    'since' => false,
    'time' => false,
])

@if ($money)
    {{ 'Rp ' . number_format($state, 0, ',', '.') }}
@elseif ($date)
    {{ \Carbon\Carbon::parse($state)->format('Y-m-d') }}
@elseif ($dateTime)
    {{ \Carbon\Carbon::parse($state)->format('Y-m-d H:i:s') }}
@elseif ($since)
    {{ \Carbon\Carbon::parse($state)->diffForHumans() }}
@elseif ($time)
    {{ \Carbon\Carbon::parse($state)->format('H:i') }}
@else
    {{ $state }}
@endif
