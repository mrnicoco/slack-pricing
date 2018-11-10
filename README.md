# SLACK PRICING ESTIMATOR

The purpose of this tool is to estimate the cost of slack based on Hip Chat past history.

After looking at their "Fair Price" policy, it appears that's it's very difficult to estimate what will cost the solution as it depends on user adoption. Because slack bought hipchat (which has a totally different pricing model), and i was trying to figures out the future cost, i wrote this few line of script to give me insights.

## What do you need

  * Hip chat uncompressed export folder
  * A shell with node (at last 8.X) available


## How do it works

For trial and error purpose the estimation is done in two step

1. Read and parse all history files from archive in order to get a punchcard of uesr activity
2. Computing the punchard and apply pricing policy


## Exemple

Step 1 :

```bash
./license_count_step1.js   /home/foo/hipchat_export/  > step1.txt
```

this will read the export from */home/foo/hipchat_export* directory and store the punchard in *step1.txt*

(in my case it took 47 secs over 16GB of history)

Step 2 :

```bash
./license_count_step2.js step1.txt
```

this will use the punch card to compute price and output price table


### Disclaimers

I've based my algorithm on MY understanding of slack pricing policy as time of doing, you can't hold me responsible for any error in my interpretation or your misuse.

This is a rainy saturday afternoon code base, sharing it just in case someone find it. But please, read the source code before execution.
 
Simulated pricing mechanism takes principles of max possible activated users and benefits from credit. It's doesnt simulate removal/deactivation of users; Users are considered added as soon as they are active. 


### Output example

```bash
User count : 206
 - 201412 ( 31 days ) | $   36 -  $   27 = $    9
 - 201501 ( 31 days ) | $   36 -  $   24 = $   12
 - 201502 ( 28 days ) | $   36 -  $   36 = $    0
 - 201503 ( 31 days ) | $  156 -  $   63 = $   93
 - 201504 ( 30 days ) | $  216 -  $   74 = $  142
 - 201505 ( 31 days ) | $  336 -  $   91 = $  245
 - 201506 ( 30 days ) | $  480 -  $   87 = $  393
 - 201507 ( 31 days ) | $  516 -  $   78 = $  438
 - 201508 ( 31 days ) | $  540 -  $   89 = $  451
 - 201509 ( 30 days ) | $  612 -  $  155 = $  457
 - 201510 ( 31 days ) | $  684 -  $  154 = $  530
 - 201511 ( 30 days ) | $  696 -  $  177 = $  519
 - 201512 ( 31 days ) | $  720 -  $  230 = $  490
 - 201601 ( 31 days ) | $  756 -  $  218 = $  538
 - 201602 ( 29 days ) | $  768 -  $  206 = $  562
 - 201603 ( 31 days ) | $  804 -  $  217 = $  587
 - 201604 ( 30 days ) | $  888 -  $  237 = $  651
 - 201605 ( 31 days ) | $  936 -  $  237 = $  699
 - 201606 ( 30 days ) | $ 1008 -  $  303 = $  705
 - 201607 ( 31 days ) | $ 1020 -  $  315 = $  705
 - 201608 ( 31 days ) | $ 1020 -  $  311 = $  709
 - 201609 ( 30 days ) | $ 1128 -  $  360 = $  768
 - 201610 ( 31 days ) | $ 1176 -  $  328 = $  848
 - 201611 ( 30 days ) | $ 1212 -  $  327 = $  885
 - 201612 ( 31 days ) | $ 1248 -  $  348 = $  900
 - 201701 ( 31 days ) | $ 1320 -  $  412 = $  908
 - 201702 ( 28 days ) | $ 1356 -  $  413 = $  943
 - 201703 ( 31 days ) | $ 1380 -  $  425 = $  955
 - 201704 ( 30 days ) | $ 1404 -  $  465 = $  939
 - 201705 ( 31 days ) | $ 1428 -  $  469 = $  959
 - 201706 ( 30 days ) | $ 1500 -  $  548 = $  952
 - 201707 ( 31 days ) | $ 1560 -  $  633 = $  927
 - 201708 ( 31 days ) | $ 1584 -  $  705 = $  879
 - 201709 ( 30 days ) | $ 1620 -  $  719 = $  901
 - 201710 ( 31 days ) | $ 1704 -  $  685 = $ 1019
 - 201711 ( 30 days ) | $ 1812 -  $  715 = $ 1097
 - 201712 ( 31 days ) | $ 1848 -  $  751 = $ 1097
 - 201801 ( 31 days ) | $ 1908 -  $  846 = $ 1062
 - 201802 ( 28 days ) | $ 1920 -  $  819 = $ 1101
 - 201803 ( 31 days ) | $ 1932 -  $  866 = $ 1066
 - 201804 ( 30 days ) | $ 2064 -  $  918 = $ 1146
 - 201805 ( 31 days ) | $ 2196 -  $ 1062 = $ 1134
 - 201806 ( 30 days ) | $ 2244 -  $ 1092 = $ 1152
 - 201807 ( 31 days ) | $ 2304 -  $ 1093 = $ 1211
 - 201808 ( 31 days ) | $ 2328 -  $ 1247 = $ 1081
 - 201809 ( 30 days ) | $ 2424 -  $ 1269 = $ 1155
 - 201810 ( 31 days ) | $ 2472 -  $ 1259 = $ 1213
 - 201811 ( 30 days ) | $ 2472 -  $ 2228 = $  244
------------------------------------------------------
total upfront : $ 59808
total paid    : $ 35477
```


