#!/usr/bin/perl

use strict;
use warnings;
$| = 1;

use POSIX ":sys_wait_h";
use Time::HiRes qw( sleep );
use Archive::Zip qw( :ERROR_CODES );

my $matches = 0;
my $CURL_LIMIT = 300;

my $file_name = "top-1m.csv";
my $zip_file_name = "$file_name.zip";
system( "curl --silent -O http://s3.amazonaws.com/alexa-static/$zip_file_name" );
my $zip = Archive::Zip->new();
my $status = $zip->read( $zip_file_name );
die "Read of $zip_file_name failed\n" if $status != AZ_OK;
$zip->extractTree();

open( my $file, $file_name ) or die "Failed to open $file_name: $!";
while ( my $line = <$file> ) {
	last if $. > $CURL_LIMIT;
	print ".";
	sleep (0.1);
	my $pid = fork();
	die "Couldn't fork: $!\n" unless defined !$pid;
	next if $pid;

	my $url = (split /,/, $line)[1];
	chomp $url;
	my $match_found = !system( "curl -m 3 -L -s -D - $url | grep Content-Security-Policy | grep -v googleapis >/dev/null" );
	if ($match_found) {
		$matches++;
		print "\r\033[2K$url\n";
	}
	exit $match_found;
}
close( $file );

my $kid;
do {
	$kid = waitpid( -1, WNOHANG );
	$matches++ if $? == 256;
} while $kid > -1;

print "\r\033[2KFound $matches matching sites after curling $CURL_LIMIT\n";
