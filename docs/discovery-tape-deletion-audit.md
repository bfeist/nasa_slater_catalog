# Discovery Tape Deletion Audit

Audit of which Discovery compilation tapes in `O:/Master 1..4` are now fully replaced by individual film-roll master files anywhere else on `/o/`.

## Scan roots

- `O:/FR-Masters` (recursive)
- `O:/70mm Panavision Collection` (recursive)

Excluded from the scan: any path containing `mpeg-proxies`, `mpeg_proxies`, `_premiere`, `_unused_scripts`, `_samples`, `proxy`, `proxies` (proxies and the Discovery-tape Master 1..4 folders themselves).

## Summary

- Total Discovery tapes catalogued: **291**
- **Safe to delete:** 61
- **Keep (incomplete coverage or unknown content):** 230
- Distinct film-roll identifiers extracted from master filenames: 2242
- Master files whose name could not be parsed to an archive ID: 64 (listed at end)

## Methodology

For each Discovery tape, the script computes the set of *expected* film rolls from two sources:

1. `discovery_shotlist.identifier` — the per-shotlist-row identifier column (authoritative when present).
2. `transfers` rows of type `discovery_capture` — these already include FR numbers mined from the free-text `shotlist_raw` column by the ingest pipeline.

It then checks whether every expected roll has a matching master file anywhere in the scan roots above. `Film` is treated as an alias for `FR`. FR numbers are matched with both 3- and 4-digit zero-padding (canonical: `FR-0748`). A tape is marked **safe to delete** only when every expected roll has a master file on disk AND the tape has no blank/unparseable shotlist rows that would imply unknown content was on that tape.

## ✅ Safe to Delete

These tapes have a per-roll master file on disk for every known film roll they contain.

| Tape | Folder | File | Rolls covered |
|-----:|:-------|:-----|--------------:|
| 512 | Master 1 | `Tape 512 - Self Contained.mov` | 9 |
| 513 | Master 1 | `Tape 513 - Self Contained.mov` | 8 |
| 541 | Master 1 | `Tape 541 - Self Contained.mov` | 8 |
| 542 | Master 1 | `Tape 542 - Self Contained.mov` | 5 |
| 544 | Master 1 | `Tape 544 - Self Contained.mov` | 9 |
| 546 | Master 1 | `Tape 546 - Self Contained.mov` | 2 |
| 547 | Master 1 | `Tape 547 - Self Contained.mov` | 3 |
| 561 | Master 1 | `Tape 561 - Self Contained.mov` | 6 |
| 565 | Master 2 | `Tape 565 - Self Contained.mov` | 5 |
| 566 | Master 2 | `Tape 566 - Self Contained.mov` | 6 |
| 570 | Master 2 | `Tape 570 - Self Contained.mov` | 5 |
| 571 | Master 2 | `Tape 571 - Self Contained.mov` | 5 |
| 573 | Master 2 | `Tape 573 - Self Contained.mov` | 8 |
| 574 | Master 2 | `Tape 574 - Self Contained.mov` | 11 |
| 575 | Master 2 | `Tape 575 - Self Contained.mov` | 6 |
| 577 | Master 2 | `Tape 577 - Self Contained.mov` | 1 |
| 580 | Master 2 | `Tape 580 - Self Contained.mov` | 3 |
| 581 | Master 2 | `Tape 581 - Self Contained.mov` | 4 |
| 582 | Master 2 | `Tape 582 - Self Contained.mov` | 3 |
| 583 | Master 2 | `Tape 583 - Self Contained.mov` | 3 |
| 585 | Master 2 | `Tape 585 - Self Contained.mov` | 6 |
| 586 | Master 2 | `Tape 586 - Self Contained.mov` | 6 |
| 587 | Master 2 | `Tape 587 - Self Contained.mov` | 6 |
| 588 | Master 2 | `Tape 588 - Self Contained.mov` | 5 |
| 605 | Master 2 | `Tape 605 - Self Contained.mov` | 7 |
| 607 | Master 2 | `Tape 607 - Self Contained.mov` | 7 |
| 609 | Master 2 | `Tape 609 - Self Contained.mov` | 7 |
| 617 | Master 2 | `Tape 617 - Self Contained.mov` | 1 |
| 621 | Master 2 | `Tape 621 - Self Contained.mov` | 5 |
| 623 | Master 2 | `Tape 623 - Self Contained.mov` | 7 |
| 624 | Master 2 | `Tape 624 - Self Contained.mov` | 5 |
| 625 | Master 2 | `Tape 625 - Self Contained.mov` | 5 |
| 626 | Master 3 | `Tape 626 - Self Contained.mov` | 5 |
| 642 | Master 3 | `Tape 642 - Self Contained.mov` | 1 |
| 650 | Master 3 | `Tape 650 - Self Contained.mov` | 6 |
| 651 | Master 3 | `Tape 651 - Self Contained.mov` | 5 |
| 652 | Master 3 | `Tape 652 - Self Contained.mov` | 6 |
| 653 | Master 3 | `Tape 653 - Self Contained.mov` | 7 |
| 655 | Master 3 | `Tape 655 - Self Contained.mov` | 5 |
| 656 | Master 3 | `Tape 656 - Self Contained.mov` | 5 |
| 657 | Master 3 | `Tape 657 - Self Contained.mov` | 4 |
| 658 | Master 3 | `Tape 658 - Self Contained.mov` | 5 |
| 659 | Master 3 | `Tape 659 - Self Contained.mov` | 1 |
| 660 | Master 3 | `Tape 660 - Self Contained.mov` | 6 |
| 661 | Master 3 | `Tape 661 - Self Contained.mov` | 4 |
| 662 | Master 3 | `Tape 662 - Self Contained.mov` | 2 |
| 664 | Master 3 | `Tape 664 - Self Contained.mov` | 6 |
| 665 | Master 3 | `Tape 665 - Self Contained.mov` | 5 |
| 667 | Master 3 | `Tape 667 - Self Contained.mov` | 5 |
| 671 | Master 3 | `Tape 671 - Self Contained.mov` | 5 |
| 672 | Master 3 | `Tape 672 - Self Contained.mov` | 8 |
| 673 | Master 3 | `Tape 673 - Self Contained.mov` | 5 |
| 677 | Master 3 | `Tape 677 - Self Contained.mov` | 5 |
| 678 | Master 3 | `Tape 678 - Self Contained.mov` | 6 |
| 685 | Master 3 | `Tape 685 - Self Contained.mov` | 7 |
| 686 | Master 3 | `Tape 686 - Self Contained.mov` | 3 |
| 687 | Master 3 | `Tape 687 - Self Contained.mov` | 6 |
| 688 | Master 3 | `Tape 688 - Self Contained.mov` | 5 |
| 689 | Master 3 | `Tape 689 - Self Contained.mov` | 3 |
| 691 | Master 3 | `Tape 691 - Self Contained.mov` | 2 |
| 755 | Master 4 | `Tape 755 - Self Contained.mov` | 1 |

### Detail per safe-to-delete tape

#### Tape 512 — `Master 1/Tape 512 - Self Contained.mov`

- `FR-0306` → `FR-Masters/Split Discovery Reels - Masters/255-FR-0306_HD_MASTER.mov`
- `FR-0343` → `FR-Masters/255-FR-0343_HD_MASTER.mov` (+1 more)
- `FR-0356` → `FR-Masters/Split Discovery Reels - Masters/255-FR-0356_HD_MASTER.mov`
- `FR-0389` → `FR-Masters/Split Discovery Reels - Masters/255-FR-0389_HD_MASTER.mov`
- `FR-0480` → `FR-Masters/Split Discovery Reels - Masters/255-FR-0480_HD_MASTER.mov`
- `FR-0552` → `FR-Masters/Split Discovery Reels - Masters/255-FR-0552_HD_MASTER.mov`
- `FR-0672` → `FR-Masters/Split Discovery Reels - Masters/255-FR-0672_HD_MASTER.mov`
- `FR-0685` → `FR-Masters/Split Discovery Reels - Masters/255-FR-0685_HD_MASTER.mov`
- `FR-0710` → `FR-Masters/Apollo 13/255-FR-0710_HD_MASTER_V2.mov` (+2 more)

#### Tape 513 — `Master 1/Tape 513 - Self Contained.mov`

- `FR-0748` → `FR-Masters/255-FR-0748_HD_MASTER.mov` (+1 more)
- `FR-0971` → `FR-Masters/Split Discovery Reels - Masters/255-FR-0971_HD_MASTER.mov`
- `FR-1025` → `FR-Masters/Split Discovery Reels - Masters/255-FR-1025_HD_MASTER.mov`
- `FR-1459` → `FR-Masters/Split Discovery Reels - Masters/255-FR-1459_HD_MASTER.mov`
- `FR-4757` → `FR-Masters/Split Discovery Reels - Masters/255-FR-4757_HD_MASTER.mov`
- `FR-4993` → `FR-Masters/Split Discovery Reels - Masters/255-FR-4993_HD_MASTER.mov`
- `FR-5603` → `FR-Masters/Split Discovery Reels - Masters/255-FR-5603_HD_MASTER.mov`
- `FR-8428` → `FR-Masters/Split Discovery Reels - Masters/255-FR-8428_HD_MASTER.mov`

#### Tape 541 — `Master 1/Tape 541 - Self Contained.mov`

- `FR-0489` → `FR-Masters/255-FR-0489_HD_MASTER.mov` (+1 more)
- `FR-0947` → `FR-Masters/Split Discovery Reels - Masters/255-FR-0947_HD_MASTER.mov`
- `FR-0948` → `FR-Masters/Split Discovery Reels - Masters/255-FR-0948_HD_MASTER.mov`
- `FR-1057` → `FR-Masters/Split Discovery Reels - Masters/255-FR-1057_HD_MASTER.mov`
- `FR-1824` → `FR-Masters/Split Discovery Reels - Masters/255-FR-1824_HD_MASTER.mov`
- `FR-4041` → `FR-Masters/Split Discovery Reels - Masters/255-FR-4041_HD_MASTER.mov`
- `FR-4196` → `FR-Masters/Split Discovery Reels - Masters/255-FR-4196_HD_MASTER.mov`
- `FR-4876` → `FR-Masters/255-FR-4876_HD_MASTER.mov` (+1 more)

#### Tape 542 — `Master 1/Tape 542 - Self Contained.mov`

- `FR-5111` → `FR-Masters/255-FR-5111_HD_MASTER.mov` (+2 more)
- `FR-5113` → `FR-Masters/Split Discovery Reels - Masters/255-FR-5113_HD_MASTER.mov`
- `FR-5933` → `FR-Masters/Split Discovery Reels - Masters/255-FR-5933_HD_MASTER.mov`
- `FR-6042` → `FR-Masters/Split Discovery Reels - Masters/255-FR-6042_HD_MASTER.mov`
- `FR-6043` → `FR-Masters/Split Discovery Reels - Masters/255-FR-6043_HD_MASTER.mov`

#### Tape 544 — `Master 1/Tape 544 - Self Contained.mov`

- `FR-4864` → `FR-Masters/Split Discovery Reels - Masters/255-FR-4864_HD_MASTER.mov`
- `FR-4912` → `FR-Masters/Split Discovery Reels - Masters/255-FR-4912_HD_MASTER.mov`
- `FR-5640` → `FR-Masters/Split Discovery Reels - Masters/255-FR-5640_HD_MASTER.mov`
- `FR-6261` → `FR-Masters/Split Discovery Reels - Masters/255-FR-6261_HD_MASTER.mov`
- `FR-6930` → `FR-Masters/Split Discovery Reels - Masters/255-FR-6930_HD_MASTER.mov`
- `FR-6950` → `FR-Masters/Split Discovery Reels - Masters/255-FR-6950_HD_MASTER.mov`
- `FR-7097` → `FR-Masters/Split Discovery Reels - Masters/255-FR-7097_HD_MASTER.mov`
- `FR-7420` → `FR-Masters/Split Discovery Reels - Masters/255-FR-7420_HD_MASTER.mov`
- `FR-7440` → `FR-Masters/Split Discovery Reels - Masters/255-FR-7440_HD_MASTER.mov`

#### Tape 546 — `Master 1/Tape 546 - Self Contained.mov`

- `FR-7762` → `FR-Masters/Split Discovery Reels - Masters/255-FR-7762_HD_MASTER.mov`
- `FR-8268` → `FR-Masters/Split Discovery Reels - Masters/255-FR-8268_HD_MASTER.mov`

#### Tape 547 — `Master 1/Tape 547 - Self Contained.mov`

- `FR-0597` → `FR-Masters/Split Discovery Reels - Masters/255-FR-0597_HD_MASTER.mov`
- `FR-0598` → `FR-Masters/Split Discovery Reels - Masters/255-FR-0598_HD_MASTER.mov`
- `FR-0599` → `FR-Masters/Split Discovery Reels - Masters/255-FR-0599_HD_MASTER.mov`

#### Tape 561 — `Master 1/Tape 561 - Self Contained.mov`

- `FR-3170` → `FR-Masters/Split Discovery Reels - Masters/255-FR-3170_HD_MASTER.mov`
- `FR-6268` → `FR-Masters/Split Discovery Reels - Masters/255-FR-6268_HD_MASTER.mov`
- `FR-6269` → `FR-Masters/Split Discovery Reels - Masters/255-FR-6269_HD_MASTER.mov`
- `FR-6363` → `FR-Masters/Split Discovery Reels - Masters/255-FR-6363_HD_MASTER.mov`
- `FR-6917` → `FR-Masters/Split Discovery Reels - Masters/255-FR-6917_HD_MASTER.mov`
- `FR-7119` → `FR-Masters/Split Discovery Reels - Masters/255-FR-7119_HD_MASTER.mov`

#### Tape 565 — `Master 2/Tape 565 - Self Contained.mov`

- `FR-7687` → `FR-Masters/Apollo 11/255-fr-7687_3K_jun13.mov` (+1 more)
- `FR-7772` → `FR-Masters/Split Discovery Reels - Masters/255-FR-7772_HD_MASTER.mov`
- `FR-7814` → `FR-Masters/Split Discovery Reels - Masters/255-FR-7814_HD_MASTER.mov`
- `FR-8108` → `FR-Masters/Split Discovery Reels - Masters/255-FR-8108_HD_MASTER.mov`
- `FR-8252` → `FR-Masters/Apollo 13/FR-8252.mov` (+3 more)

#### Tape 566 — `Master 2/Tape 566 - Self Contained.mov`

- `FR-1274` → `FR-Masters/Split Discovery Reels - Masters/255-FR-1274_HD_MASTER.mov`
- `FR-6182` → `FR-Masters/Split Discovery Reels - Masters/255-FR-6182_HD_MASTER.mov`
- `FR-8253` → `FR-Masters/255-FR-8253_2K_MASTER.mov` (+3 more)
- `FR-8255` → `FR-Masters/Apollo 13/FR-8255.mov` (+1 more)
- `FR-8262` → `FR-Masters/Split Discovery Reels - Masters/255-FR-8262_HD_MASTER.mov`
- `FR-8263` → `FR-Masters/Split Discovery Reels - Masters/255-FR-8263_HD_MASTER.mov`

#### Tape 570 — `Master 2/Tape 570 - Self Contained.mov`

- `FR-9611` → `FR-Masters/Split Discovery Reels - Masters/255-FR-9611_HD_MASTER.mov`
- `FR-B153` → `FR-Masters/Split Discovery Reels - Masters/255-FR-B153_HD_MASTER.mov`
- `FR-B159` → `FR-Masters/Split Discovery Reels - Masters/255-FR-B159_HD_MASTER.mov`
- `FR-B545` → `FR-Masters/Split Discovery Reels - Masters/255-FR-B545_HD_MASTER.mov`
- `FR-B960` → `FR-Masters/Split Discovery Reels - Masters/255-FR-B960_HD_MASTER.mov`

#### Tape 571 — `Master 2/Tape 571 - Self Contained.mov`

- `FR-1136` → `FR-Masters/Split Discovery Reels - Masters/255-FR-1136_HD_MASTER.mov`
- `FR-1219` → `FR-Masters/Apollo 13/255-FR-1219.mov` (+2 more)
- `FR-1220` → `FR-Masters/Split Discovery Reels - Masters/255-FR-1220_HD_MASTER.mov`
- `FR-A788` → `FR-Masters/Split Discovery Reels - Masters/255-FR-A788_HD_MASTER.mov`
- `FR-C007` → `FR-Masters/Split Discovery Reels - Masters/255-FR-C007_HD_MASTER.mov`

#### Tape 573 — `Master 2/Tape 573 - Self Contained.mov`

- `FR-2594` → `FR-Masters/Split Discovery Reels - Masters/255-FR-2594_HD_MASTER.mov`
- `FR-2727` → `FR-Masters/Split Discovery Reels - Masters/255-FR-2727_HD_MASTER.mov`
- `FR-2896` → `FR-Masters/Split Discovery Reels - Masters/255-FR-2896_HD_MASTER.mov`
- `FR-3166` → `FR-Masters/Split Discovery Reels - Masters/255-FR-3166_HD_MASTER.mov`
- `FR-3659` → `FR-Masters/Split Discovery Reels - Masters/255-FR-3659_HD_MASTER.mov`
- `FR-3782` → `FR-Masters/Split Discovery Reels - Masters/255-FR-3782_HD_MASTER.mov`
- `FR-3793` → `FR-Masters/Split Discovery Reels - Masters/255-FR-3793_HD_MASTER.mov`
- `FR-3802` → `FR-Masters/Split Discovery Reels - Masters/255-FR-3802_HD_MASTER.mov`

#### Tape 574 — `Master 2/Tape 574 - Self Contained.mov`

- `FR-3806` → `FR-Masters/Split Discovery Reels - Masters/255-FR-3806_HD_MASTER.mov`
- `FR-3811` → `FR-Masters/Split Discovery Reels - Masters/255-FR-3811_HD_MASTER.mov`
- `FR-3838` → `FR-Masters/Split Discovery Reels - Masters/255-FR-3838_HD_MASTER.mov`
- `FR-3856` → `FR-Masters/Split Discovery Reels - Masters/255-FR-3856_HD_MASTER.mov`
- `FR-3859` → `FR-Masters/Split Discovery Reels - Masters/255-FR-3859_HD_MASTER.mov`
- `FR-3861` → `FR-Masters/Split Discovery Reels - Masters/255-FR-3861_HD_MASTER.mov`
- `FR-3893` → `FR-Masters/Split Discovery Reels - Masters/255-FR-3893_HD_MASTER.mov`
- `FR-3988` → `FR-Masters/Split Discovery Reels - Masters/255-FR-3988_HD_MASTER.mov`
- `FR-4201` → `FR-Masters/Split Discovery Reels - Masters/255-FR-4201_HD_MASTER.mov`
- `FR-4330` → `FR-Masters/Split Discovery Reels - Masters/255-FR-4330_HD_MASTER.mov`
- `FR-5977` → `FR-Masters/Split Discovery Reels - Masters/255-FR-5977_HD_MASTER.mov`

#### Tape 575 — `Master 2/Tape 575 - Self Contained.mov`

- `FR-4885` → `FR-Masters/Split Discovery Reels - Masters/255-FR-4885_HD_MASTER.mov`
- `FR-5033` → `FR-Masters/Split Discovery Reels - Masters/255-FR-5033_HD_MASTER.mov`
- `FR-5566` → `FR-Masters/Split Discovery Reels - Masters/255-FR-5566_HD_MASTER.mov`
- `FR-5588` → `FR-Masters/Split Discovery Reels - Masters/255-FR-5588_HD_MASTER.mov`
- `FR-5972` → `FR-Masters/Split Discovery Reels - Masters/255-FR-5972_HD_MASTER.mov`
- `FR-5974` → `FR-Masters/Split Discovery Reels - Masters/255-FR-5974_HD_MASTER.mov`

#### Tape 577 — `Master 2/Tape 577 - Self Contained.mov`

- `FR-4109` → `FR-Masters/Split Discovery Reels - Masters/255-FR-4109_HD_MASTER.mov`

#### Tape 580 — `Master 2/Tape 580 - Self Contained.mov`

- `FR-B964` → `FR-Masters/Split Discovery Reels - Masters/255-FR-B964_HD_MASTER.mov`
- `FR-B996` → `FR-Masters/Split Discovery Reels - Masters/255-FR-B996_HD_MASTER.mov`
- `FR-C027` → `FR-Masters/Split Discovery Reels - Masters/255-FR-C027_HD_MASTER.mov`

#### Tape 581 — `Master 2/Tape 581 - Self Contained.mov`

- `FR-D504` → `FR-Masters/Split Discovery Reels - Masters/255-FR-D504_HD_MASTER.mov`
- `FR-D513` → `FR-Masters/Split Discovery Reels - Masters/255-FR-D513_HD_MASTER.mov`
- `FR-D514` → `FR-Masters/Split Discovery Reels - Masters/255-FR-D514_HD_MASTER.mov`
- `FR-D530` → `FR-Masters/Split Discovery Reels - Masters/255-FR-D530_HD_MASTER.mov`

#### Tape 582 — `Master 2/Tape 582 - Self Contained.mov`

- `FR-D535` → `FR-Masters/255-FR-D535_HD_MASTER.mov` (+1 more)
- `FR-D538` → `FR-Masters/Split Discovery Reels - Masters/255-FR-D538_HD_MASTER.mov`
- `FR-D546` → `FR-Masters/Split Discovery Reels - Masters/255-FR-D546_HD_MASTER.mov`

#### Tape 583 — `Master 2/Tape 583 - Self Contained.mov`

- `FR-D659` → `FR-Masters/Split Discovery Reels - Masters/255-FR-D659_HD_MASTER.mov`
- `FR-D660` → `FR-Masters/Split Discovery Reels - Masters/255-FR-D660_HD_MASTER.mov`
- `FR-D661` → `FR-Masters/Split Discovery Reels - Masters/255-FR-D661_HD_MASTER.mov`

#### Tape 585 — `Master 2/Tape 585 - Self Contained.mov`

- `FR-D580` → `FR-Masters/Split Discovery Reels - Masters/255-FR-D580_HD_MASTER.mov`
- `FR-D581` → `FR-Masters/Split Discovery Reels - Masters/255-FR-D581_HD_MASTER.mov`
- `FR-D582` → `FR-Masters/Split Discovery Reels - Masters/255-FR-D582_HD_MASTER.mov`
- `FR-D583` → `FR-Masters/Split Discovery Reels - Masters/255-FR-D583_HD_MASTER.mov`
- `FR-D584` → `FR-Masters/Split Discovery Reels - Masters/255-FR-D584_HD_MASTER.mov`
- `FR-D585` → `FR-Masters/Split Discovery Reels - Masters/255-FR-D585_HD_MASTER.mov`

#### Tape 586 — `Master 2/Tape 586 - Self Contained.mov`

- `FR-B539` → `FR-Masters/255-FR-B539_HD_MASTER.mov` (+1 more)
- `FR-B641` → `FR-Masters/255-FR-B641_HD_MASTER.mov` (+1 more)
- `FR-B678` → `FR-Masters/255-FR-B678_HD_MASTER.mov` (+1 more)
- `FR-B694` → `FR-Masters/Split Discovery Reels - Masters/255-FR-B694_HD_MASTER.mov`
- `FR-B746` → `FR-Masters/Split Discovery Reels - Masters/255-FR-B746_HD_MASTER.mov`
- `FR-B747` → `FR-Masters/Split Discovery Reels - Masters/255-FR-B747_HD_MASTER.mov`

#### Tape 587 — `Master 2/Tape 587 - Self Contained.mov`

- `FR-B766` → `FR-Masters/Split Discovery Reels - Masters/255-FR-B766_HD_MASTER.mov`
- `FR-B967` → `FR-Masters/Split Discovery Reels - Masters/255-FR-B967_HD_MASTER.mov`
- `FR-B968` → `FR-Masters/Split Discovery Reels - Masters/255-FR-B968_HD_MASTER.mov`
- `FR-C061` → `FR-Masters/Split Discovery Reels - Masters/255-FR-C061_HD_MASTER.mov`
- `FR-C075` → `FR-Masters/Split Discovery Reels - Masters/255-FR-C075_HD_MASTER.mov`
- `FR-C076` → `FR-Masters/Split Discovery Reels - Masters/255-FR-C076_HD_MASTER.mov`

#### Tape 588 — `Master 2/Tape 588 - Self Contained.mov`

- `FR-C141` → `FR-Masters/Split Discovery Reels - Masters/255-FR-C141_HD_MASTER.mov`
- `FR-C142` → `FR-Masters/Split Discovery Reels - Masters/255-FR-C142_HD_MASTER.mov`
- `FR-C193` → `FR-Masters/Split Discovery Reels - Masters/255-FR-C193_HD_MASTER.mov`
- `FR-C197` → `FR-Masters/Split Discovery Reels - Masters/255-FR-C197_HD_MASTER.mov`
- `FR-C204` → `FR-Masters/Split Discovery Reels - Masters/255-FR-C204_HD_MASTER.mov`

#### Tape 605 — `Master 2/Tape 605 - Self Contained.mov`

- `FR-6120` → `FR-Masters/Split Discovery Reels - Masters/255-FR-6120_HD_MASTER.mov`
- `FR-7073` → `FR-Masters/Split Discovery Reels - Masters/255-FR-7073_HD_MASTER.mov`
- `FR-7074` → `FR-Masters/Split Discovery Reels - Masters/255-FR-7074_HD_MASTER.mov`
- `FR-7108` → `FR-Masters/Split Discovery Reels - Masters/255-FR-7108_HD_MASTER.mov`
- `FR-7167` → `FR-Masters/Split Discovery Reels - Masters/255-FR-7167_HD_MASTER.mov`
- `FR-7168` → `FR-Masters/Split Discovery Reels - Masters/255-FR-7168_HD_MASTER.mov`
- `FR-7169` → `FR-Masters/Split Discovery Reels - Masters/255-FR-7169_HD_MASTER.mov`

#### Tape 607 — `Master 2/Tape 607 - Self Contained.mov`

- `FR-7041` → `FR-Masters/Split Discovery Reels - Masters/255-FR-7041_HD_MASTER.mov`
- `FR-7104` → `FR-Masters/Split Discovery Reels - Masters/255-FR-7104_HD_MASTER.mov`
- `FR-7126` → `FR-Masters/Split Discovery Reels - Masters/255-FR-7126_HD_MASTER.mov`
- `FR-7155` → `FR-Masters/Split Discovery Reels - Masters/255-FR-7155_HD_MASTER.mov`
- `FR-7194` → `FR-Masters/Split Discovery Reels - Masters/255-FR-7194_HD_MASTER.mov`
- `FR-7197` → `FR-Masters/Split Discovery Reels - Masters/255-FR-7197_HD_MASTER.mov`
- `FR-7198` → `FR-Masters/Split Discovery Reels - Masters/255-FR-7198_HD_MASTER.mov`

#### Tape 609 — `Master 2/Tape 609 - Self Contained.mov`

- `FR-0792` → `FR-Masters/255-FR-0792_HD_MASTER.mov` (+1 more)
- `FR-0796` → `FR-Masters/Split Discovery Reels - Masters/255-FR-0796_HD_MASTER.mov`
- `FR-7217` → `FR-Masters/Split Discovery Reels - Masters/255-FR-7217_HD_MASTER.mov`
- `FR-7218` → `FR-Masters/Split Discovery Reels - Masters/255-FR-7218_HD_MASTER.mov`
- `FR-7240` → `FR-Masters/Split Discovery Reels - Masters/255-FR-7240_HD_MASTER.mov`
- `FR-7243` → `FR-Masters/Split Discovery Reels - Masters/255-FR-7243_HD_MASTER.mov`
- `FR-7328` → `FR-Masters/Split Discovery Reels - Masters/255-FR-7328_HD_MASTER.mov`

#### Tape 617 — `Master 2/Tape 617 - Self Contained.mov`

- `FR-8953` → `FR-Masters/255-FR-8953_HD_MASTER.mov` (+1 more)

#### Tape 621 — `Master 2/Tape 621 - Self Contained.mov`

- `FR-9103` → `FR-Masters/Split Discovery Reels - Masters/255-FR-9103_HD_MASTER.mov`
- `FR-9111` → `FR-Masters/Split Discovery Reels - Masters/255-FR-9111_HD_MASTER.mov`
- `FR-9198` → `FR-Masters/Split Discovery Reels - Masters/255-FR-9198_HD_MASTER.mov`
- `FR-9318` → `FR-Masters/Split Discovery Reels - Masters/255-FR-9318_HD_MASTER.mov`
- `FR-9427` → `FR-Masters/Split Discovery Reels - Masters/255-FR-9427_HD_MASTER.mov`

#### Tape 623 — `Master 2/Tape 623 - Self Contained.mov`

- `FR-9974` → `FR-Masters/255-FR-9974_HD_MASTER.mov` (+1 more)
- `FR-9975` → `FR-Masters/Split Discovery Reels - Masters/255-FR-9975_HD_MASTER.mov`
- `FR-9986` → `FR-Masters/Split Discovery Reels - Masters/255-FR-9986_HD_MASTER.mov`
- `FR-A190` → `FR-Masters/Split Discovery Reels - Masters/255-FR-A190_HD_MASTER.mov`
- `FR-A681` → `FR-Masters/Split Discovery Reels - Masters/255-FR-A681_HD_MASTER.mov`
- `FR-A927` → `FR-Masters/Split Discovery Reels - Masters/255-FR-A927_HD_MASTER.mov`
- `FR-B241` → `FR-Masters/Split Discovery Reels - Masters/255-FR-B241_HD_MASTER.mov`

#### Tape 624 — `Master 2/Tape 624 - Self Contained.mov`

- `FR-B246` → `FR-Masters/Split Discovery Reels - Masters/255-FR-B246_HD_MASTER.mov`
- `FR-B247` → `FR-Masters/Split Discovery Reels - Masters/255-FR-B247_HD_MASTER.mov`
- `FR-B499` → `FR-Masters/255-FR-B499_HD_MASTER.mov` (+1 more)
- `FR-B716` → `FR-Masters/Split Discovery Reels - Masters/255-FR-B716_HD_MASTER.mov`
- `FR-B835` → `FR-Masters/Split Discovery Reels - Masters/255-FR-B835_HD_MASTER.mov`

#### Tape 625 — `Master 2/Tape 625 - Self Contained.mov`

- `FR-B788` → `FR-Masters/Split Discovery Reels - Masters/255-FR-B788_HD_MASTER.mov`
- `FR-B855` → `FR-Masters/Split Discovery Reels - Masters/255-FR-B855_HD_MASTER.mov`
- `FR-B988` → `FR-Masters/255-FR-B988_HD_MASTER.mov` (+1 more)
- `FR-C477` → `FR-Masters/255-FR-C477_HD_MASTER.mov` (+1 more)
- `FR-C650` → `FR-Masters/Split Discovery Reels - Masters/255-FR-C650_HD_MASTER.mov`

#### Tape 626 — `Master 3/Tape 626 - Self Contained.mov`

- `FR-C653` → `FR-Masters/Split Discovery Reels - Masters/255-FR-C653_HD_MASTER.mov`
- `FR-D532` → `FR-Masters/Split Discovery Reels - Masters/255-FR-D532_HD_MASTER.mov`
- `FR-E332` → `FR-Masters/Split Discovery Reels - Masters/255-FR-E332_HD_MASTER.mov`
- `FR-E803` → `FR-Masters/255-FR-E803_HD_MASTER.mov` (+1 more)
- `FR-E805` → `FR-Masters/Split Discovery Reels - Masters/255-FR-E805_HD_MASTER.mov`

#### Tape 642 — `Master 3/Tape 642 - Self Contained.mov`

- `FR-G067` → `FR-Masters/Split Discovery Reels - Masters/255-FR-G067_HD_MASTER.mov`

#### Tape 650 — `Master 3/Tape 650 - Self Contained.mov`

- `FR-E139` → `FR-Masters/Split Discovery Reels - Masters/255-FR-E139_HD_MASTER.mov`
- `FR-E787` → `FR-Masters/255-FR-E787_HD_MASTER.mov` (+1 more)
- `FR-E790` → `FR-Masters/255-FR-E790_HD_MASTER.mov` (+1 more)
- `FR-E791` → `FR-Masters/Split Discovery Reels - Masters/255-FR-E791_HD_MASTER.mov`
- `FR-E801` → `FR-Masters/Split Discovery Reels - Masters/255-FR-E801_HD_MASTER.mov`
- `FR-G154` → `FR-Masters/Split Discovery Reels - Masters/255-FR-G154_HD_MASTER.mov`

#### Tape 651 — `Master 3/Tape 651 - Self Contained.mov`

- `FR-G155` → `FR-Masters/Split Discovery Reels - Masters/255-FR-G155_HD_MASTER.mov`
- `FR-G156` → `FR-Masters/Split Discovery Reels - Masters/255-FR-G156_HD_MASTER.mov`
- `FR-G157` → `FR-Masters/Split Discovery Reels - Masters/255-FR-G157_HD_MASTER.mov`
- `FR-G158` → `FR-Masters/Split Discovery Reels - Masters/255-FR-G158_HD_MASTER.mov`
- `FR-G159` → `FR-Masters/Split Discovery Reels - Masters/255-FR-G159_HD_MASTER.mov`

#### Tape 652 — `Master 3/Tape 652 - Self Contained.mov`

- `FR-E138` → `FR-Masters/Split Discovery Reels - Masters/255-FR-E138_HD_MASTER.mov`
- `FR-G029` → `FR-Masters/Split Discovery Reels - Masters/255-FR-G029_HD_MASTER.mov`
- `FR-G165` → `FR-Masters/Split Discovery Reels - Masters/255-FR-G165_HD_MASTER.mov`
- `FR-G167` → `FR-Masters/Split Discovery Reels - Masters/255-FR-G167_HD_MASTER.mov`
- `FR-G169` → `FR-Masters/Split Discovery Reels - Masters/255-FR-G169_HD_MASTER.mov`
- `FR-G171` → `FR-Masters/255-FR-G171_HD_MASTER.mov` (+1 more)

#### Tape 653 — `Master 3/Tape 653 - Self Contained.mov`

- `FR-C652` → `FR-Masters/Split Discovery Reels - Masters/255-FR-C652_HD_MASTER.mov`
- `FR-C921` → `FR-Masters/Split Discovery Reels - Masters/255-FR-C921_HD_MASTER.mov`
- `FR-C922` → `FR-Masters/Split Discovery Reels - Masters/255-FR-C922_HD_MASTER.mov`
- `FR-C923` → `FR-Masters/Split Discovery Reels - Masters/255-FR-C923_HD_MASTER.mov`
- `FR-C924` → `FR-Masters/Split Discovery Reels - Masters/255-FR-C924_HD_MASTER.mov`
- `FR-D803` → `FR-Masters/Split Discovery Reels - Masters/255-FR-D803_HD_MASTER.mov`
- `FR-E140` → `FR-Masters/Split Discovery Reels - Masters/255-FR-E140_HD_MASTER.mov`

#### Tape 655 — `Master 3/Tape 655 - Self Contained.mov`

- `FR-E785` → `FR-Masters/Split Discovery Reels - Masters/255-FR-E785_HD_MASTER.mov`
- `FR-E786` → `FR-Masters/Split Discovery Reels - Masters/255-FR-E786_HD_MASTER.mov`
- `FR-E811` → `FR-Masters/Split Discovery Reels - Masters/255-FR-E811_HD_MASTER.mov`
- `FR-E957` → `FR-Masters/255-FR-E957_HD_MASTER.mov` (+1 more)
- `FR-G031` → `FR-Masters/Split Discovery Reels - Masters/255-FR-G031_HD_MASTER.mov`

#### Tape 656 — `Master 3/Tape 656 - Self Contained.mov`

- `FR-G085` → `FR-Masters/Split Discovery Reels - Masters/255-FR-G085_HD_MASTER.mov`
- `FR-G086` → `FR-Masters/Split Discovery Reels - Masters/255-FR-G086_HD_MASTER.mov`
- `FR-G150` → `FR-Masters/Split Discovery Reels - Masters/255-FR-G150_HD_MASTER.mov`
- `FR-G152` → `FR-Masters/Split Discovery Reels - Masters/255-FR-G152_HD_MASTER.mov`
- `FR-G153` → `FR-Masters/Split Discovery Reels - Masters/255-FR-G153_HD_MASTER.mov`

#### Tape 657 — `Master 3/Tape 657 - Self Contained.mov`

- `FR-G160` → `FR-Masters/Split Discovery Reels - Masters/255-FR-G160_HD_MASTER.mov`
- `FR-G162` → `FR-Masters/Split Discovery Reels - Masters/255-FR-G162_HD_MASTER.mov`
- `FR-G163` → `FR-Masters/Split Discovery Reels - Masters/255-FR-G163_HD_MASTER.mov`
- `FR-G164` → `FR-Masters/Split Discovery Reels - Masters/255-FR-G164_HD_MASTER.mov`

#### Tape 658 — `Master 3/Tape 658 - Self Contained.mov`

- `FR-G166` → `FR-Masters/255-FR-G166_HD_MASTER.mov` (+1 more)
- `FR-G168` → `FR-Masters/Split Discovery Reels - Masters/255-FR-G168_HD_MASTER.mov`
- `FR-G170` → `FR-Masters/Split Discovery Reels - Masters/255-FR-G170_HD_MASTER.mov`
- `FR-G172` → `FR-Masters/Split Discovery Reels - Masters/255-FR-G172_HD_MASTER.mov`
- `FR-G173` → `FR-Masters/Split Discovery Reels - Masters/255-FR-G173_HD_MASTER.mov`

#### Tape 659 — `Master 3/Tape 659 - Self Contained.mov`

- `FR-G174` → `FR-Masters/Split Discovery Reels - Masters/255-FR-G174_HD_MASTER.mov`

#### Tape 660 — `Master 3/Tape 660 - Self Contained.mov`

- `FR-8258` → `FR-Masters/255-FR-8258_HD_MASTER.mov` (+2 more)
- `FR-8259` → `FR-Masters/Apollo 13/FR-8259.mov` (+1 more)
- `FR-8260` → `FR-Masters/Apollo 13/FR-8260.mov` (+1 more)
- `FR-8261` → `FR-Masters/255-FR-8261_HD_MASTER.mov` (+1 more)
- `FR-9405` → `FR-Masters/Split Discovery Reels - Masters/255-FR-9405_HD_MASTER.mov`
- `FR-9469` → `FR-Masters/Split Discovery Reels - Masters/255-FR-9469_HD_MASTER.mov`

#### Tape 661 — `Master 3/Tape 661 - Self Contained.mov`

- `FR-9827` → `FR-Masters/Split Discovery Reels - Masters/255-FR-9827_HD_MASTER.mov`
- `FR-9833` → `FR-Masters/255-FR-9833_HD_MASTER.mov` (+1 more)
- `FR-B792` → `FR-Masters/Split Discovery Reels - Masters/255-FR-B792_HD_MASTER.mov`
- `FR-E357` → `FR-Masters/Split Discovery Reels - Masters/255-FR-E357_HD_MASTER.mov`

#### Tape 662 — `Master 3/Tape 662 - Self Contained.mov`

- `FR-7683` → `FR-Masters/Split Discovery Reels - Masters/255-FR-7683_HD_MASTER.mov`
- `FR-7686` → `FR-Masters/Split Discovery Reels - Masters/255-FR-7686_HD_MASTER.mov`

#### Tape 664 — `Master 3/Tape 664 - Self Contained.mov`

- `FR-0405` → `FR-Masters/Split Discovery Reels - Masters/255-FR-0405_HD_MASTER.mov`
- `FR-0429` → `FR-Masters/Split Discovery Reels - Masters/255-FR-0429_HD_MASTER.mov`
- `FR-0431` → `FR-Masters/Split Discovery Reels - Masters/255-FR-0431_HD_MASTER.mov`
- `FR-0476` → `FR-Masters/Split Discovery Reels - Masters/255-FR-0476_HD_MASTER.mov`
- `FR-0502` → `FR-Masters/Split Discovery Reels - Masters/255-FR-0502_HD_MASTER.mov`
- `FR-0559` → `FR-Masters/255-FR-0559_HD_MASTER.mov` (+1 more)

#### Tape 665 — `Master 3/Tape 665 - Self Contained.mov`

- `FR-0483` → `FR-Masters/Split Discovery Reels - Masters/255-FR-0483_HD_MASTER.mov`
- `FR-0489` → `FR-Masters/255-FR-0489_HD_MASTER.mov` (+1 more)
- `FR-0576-2` → `FR-Masters/Split Discovery Reels - Masters/255-FR-0576.2_MASTER.mov`
- `FR-0875-1` → `FR-Masters/255-FR-0875.1_HD_MASTER.mov` (+1 more)
- `FR-0918` → `FR-Masters/Split Discovery Reels - Masters/255-FR-0918_HD_MASTER.mov`

#### Tape 667 — `Master 3/Tape 667 - Self Contained.mov`

- `FR-A203` → `FR-Masters/Split Discovery Reels - Masters/255-FR-A203_HD_MASTER.mov`
- `FR-A214` → `FR-Masters/Split Discovery Reels - Masters/255-FR-A214_HD_MASTER.mov`
- `FR-A217` → `FR-Masters/Split Discovery Reels - Masters/255-FR-A217_HD_MASTER.mov`
- `FR-A227` → `FR-Masters/Split Discovery Reels - Masters/255-FR-A227_HD_MASTER.mov`
- `FR-E739` → `FR-Masters/Split Discovery Reels - Masters/255-FR-E739_HD_MASTER.mov`

#### Tape 671 — `Master 3/Tape 671 - Self Contained.mov`

- `FR-9715` → `FR-Masters/Split Discovery Reels - Masters/255-FR-9715_HD_MASTER.mov`
- `FR-9804` → `FR-Masters/Split Discovery Reels - Masters/255-FR-9804_HD_MASTER.mov`
- `FR-A047` → `FR-Masters/Split Discovery Reels - Masters/255-FR-A047_HD_MASTER.mov`
- `FR-A048` → `FR-Masters/Split Discovery Reels - Masters/255-FR-A048_HD_MASTER.mov`
- `FR-A341` → `FR-Masters/Split Discovery Reels - Masters/255-FR-A341_HD_MASTER.mov`

#### Tape 672 — `Master 3/Tape 672 - Self Contained.mov`

- `FR-7894` → `FR-Masters/Split Discovery Reels - Masters/255-FR-7894_HD_MASTER.mov`
- `FR-7898` → `FR-Masters/Split Discovery Reels - Masters/255-FR-7898_HD_MASTER.mov`
- `FR-8167` → `FR-Masters/Split Discovery Reels - Masters/255-FR-8167_HD_MASTER.mov`
- `FR-8202` → `FR-Masters/255-FR-8202_HD_MASTER.mov` (+1 more)
- `FR-8271` → `FR-Masters/Split Discovery Reels - Masters/255-FR-8271_HD_MASTER.mov`
- `FR-8272` → `FR-Masters/255-FR-8272_HD_MASTER.mov` (+1 more)
- `FR-8336` → `FR-Masters/Split Discovery Reels - Masters/255-FR-8336_HD_MASTER.mov`
- `FR-9040` → `FR-Masters/255-FR-9040_HD_MASTER.mov` (+1 more)

#### Tape 673 — `Master 3/Tape 673 - Self Contained.mov`

- `FR-8875` → `FR-Masters/Split Discovery Reels - Masters/255-FR-8875_HD_MASTER.mov`
- `FR-8919` → `FR-Masters/Split Discovery Reels - Masters/255-FR-8919_HD_MASTER.mov`
- `FR-8999` → `FR-Masters/Split Discovery Reels - Masters/255-FR-8999_HD_MASTER.mov`
- `FR-9031` → `FR-Masters/Split Discovery Reels - Masters/255-FR-9031_HD_MASTER.mov`
- `FR-9032` → `FR-Masters/Split Discovery Reels - Masters/255-FR-9032_HD_MASTER.mov`

#### Tape 677 — `Master 3/Tape 677 - Self Contained.mov`

- `FR-E754` → `FR-Masters/Split Discovery Reels - Masters/255-FR-E754_HD_MASTER.mov`
- `FR-E762` → `FR-Masters/Split Discovery Reels - Masters/255-FR-E762_HD_MASTER.mov`
- `FR-E788` → `FR-Masters/Split Discovery Reels - Masters/255-FR-E788_HD_MASTER.mov`
- `FR-E789` → `FR-Masters/Split Discovery Reels - Masters/255-FR-E789_HD_MASTER.mov`
- `FR-E796` → `FR-Masters/Split Discovery Reels - Masters/255-FR-E796_HD_MASTER.mov`

#### Tape 678 — `Master 3/Tape 678 - Self Contained.mov`

- `FR-E797` → `FR-Masters/Split Discovery Reels - Masters/255-FR-E797_HD_MASTER.mov`
- `FR-E798` → `FR-Masters/Split Discovery Reels - Masters/255-FR-E798_HD_MASTER.mov`
- `FR-E799` → `FR-Masters/Split Discovery Reels - Masters/255-FR-E799_HD_MASTER.mov`
- `FR-E804` → `FR-Masters/Split Discovery Reels - Masters/255-FR-E804_HD_MASTER.mov`
- `FR-E809` → `FR-Masters/Split Discovery Reels - Masters/255-FR-E809_HD_MASTER.mov`
- `FR-E815` → `FR-Masters/Split Discovery Reels - Masters/255-FR-E815_HD_MASTER.mov`

#### Tape 685 — `Master 3/Tape 685 - Self Contained.mov`

- `FR-9741` → `FR-Masters/Split Discovery Reels - Masters/255-FR-9741_HD_MASTER.mov`
- `FR-9742` → `FR-Masters/Split Discovery Reels - Masters/255-FR-9742_HD_MASTER.mov`
- `FR-9744` → `FR-Masters/Split Discovery Reels - Masters/255-FR-9744_HD_MASTER.mov`
- `FR-9746` → `FR-Masters/Split Discovery Reels - Masters/255-FR-9746_HD_MASTER.mov`
- `FR-9749` → `FR-Masters/Split Discovery Reels - Masters/255-FR-9749_HD_MASTER.mov`
- `FR-9750` → `FR-Masters/255-FR-9750_HD_MASTER.mov` (+1 more)
- `FR-G179` → `FR-Masters/Split Discovery Reels - Masters/255-FR-G179_HD_MASTER.mov`

#### Tape 686 — `Master 3/Tape 686 - Self Contained.mov`

- `FR-9326` → `FR-Masters/Apollo 16/Apollo 16 MOCR sound added/FR-9326.mov` (+1 more)
- `FR-9327` → `FR-Masters/Apollo 16/Apollo 16 MOCR sound added/FR-9327.mov` (+1 more)
- `FR-9341` → `FR-Masters/Apollo 16/Apollo 16 MOCR sound added/FR-9341.mov` (+1 more)

#### Tape 687 — `Master 3/Tape 687 - Self Contained.mov`

- `FR-9342` → `FR-Masters/Apollo 16/Apollo 16 MOCR sound added/FR-9342.mov` (+1 more)
- `FR-9343` → `FR-Masters/Apollo 16/Apollo 16 MOCR sound added/FR-9343.mov` (+1 more)
- `FR-9344` → `FR-Masters/Apollo 16/Apollo 16 MOCR sound added/FR-9344.mov` (+1 more)
- `FR-9347` → `FR-Masters/Apollo 16/Apollo 16 MOCR sound added/FR-9347.mov` (+1 more)
- `FR-9348` → `FR-Masters/Split Discovery Reels - Masters/255-FR-9348_HD_MASTER.mov`
- `FR-9559` → `FR-Masters/Split Discovery Reels - Masters/255-FR-9559_HD_MASTER.mov`

#### Tape 688 — `Master 3/Tape 688 - Self Contained.mov`

- `FR-9560` → `FR-Masters/Split Discovery Reels - Masters/255-FR-9560_HD_MASTER.mov`
- `FR-9561` → `FR-Masters/Split Discovery Reels - Masters/255-FR-9561_HD_MASTER.mov`
- `FR-9562` → `FR-Masters/Split Discovery Reels - Masters/255-FR-9562_HD_MASTER.mov`
- `FR-9563` → `FR-Masters/Split Discovery Reels - Masters/255-FR-9563_HD_MASTER.mov`
- `FR-9565` → `FR-Masters/Split Discovery Reels - Masters/255-FR-9565_HD_MASTER.mov`

#### Tape 689 — `Master 3/Tape 689 - Self Contained.mov`

- `FR-9567` → `FR-Masters/Split Discovery Reels - Masters/255-FR-9567_HD_MASTER.mov`
- `FR-9569` → `FR-Masters/Split Discovery Reels - Masters/255-FR-9569_HD_MASTER.mov`
- `FR-9570` → `FR-Masters/Split Discovery Reels - Masters/255-FR-9570_HD_MASTER.mov`

#### Tape 691 — `Master 3/Tape 691 - Self Contained.mov`

- `FR-B464` → `FR-Masters/Split Discovery Reels - Masters/255-FR-B464_HD_MASTER.mov`
- `FR-B471` → `FR-Masters/Split Discovery Reels - Masters/255-FR-B471_HD_MASTER.mov`

#### Tape 755 — `Master 4/Tape 755 - Self Contained.mov`

- `FR-0598` → `FR-Masters/Split Discovery Reels - Masters/255-FR-0598_HD_MASTER.mov`

## ❌ Keep — Cannot Be Deleted

These tapes are missing one or more expected master files, or contain shotlist content with no parseable archive identifier.

| Tape | Folder | Expected | Present | Missing | Reasons |
|-----:|:-------|--------:|--------:|--------:|:--------|
| 501 | Master 1 | 3 | 0 | 3 | 3 expected roll(s) have no master file on disk |
| 502 | Master 1 | 2 | 0 | 2 | 2 expected roll(s) have no master file on disk |
| 503 | Master 1 | 2 | 0 | 2 | 2 expected roll(s) have no master file on disk |
| 504 | Master 1 | 3 | 1 | 2 | 2 expected roll(s) have no master file on disk |
| 505 | Master 1 | 4 | 0 | 4 | 4 expected roll(s) have no master file on disk; 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 506 | Master 1 | 4 | 0 | 4 | 4 expected roll(s) have no master file on disk |
| 507 | Master 1 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 508 | Master 1 | 8 | 8 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 509 | Master 1 | 5 | 5 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 510 | Master 1 | 5 | 4 | 1 | 1 expected roll(s) have no master file on disk |
| 511 | Master 1 | 8 | 7 | 1 | 1 expected roll(s) have no master file on disk |
| 514 | Master 1 | 0 | 0 | 0 | 2 shotlist row(s) on this tape have a blank identifier (unknown content); 10 non-archive identifier(s) on this tape (e.g. 802260, : Mag 198, Can 01) |
| 515 | Master 1 | 5 | 1 | 4 | 4 expected roll(s) have no master file on disk; 2 shotlist row(s) on this tape have a blank identifier (unknown content); 1 non-archive identifier(s) on this tape (e.g. 802262) |
| 516 | Master 1 | 4 | 1 | 3 | 3 expected roll(s) have no master file on disk; 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 517 | Master 1 | 5 | 0 | 5 | 5 expected roll(s) have no master file on disk |
| 518 | Master 1 | 3 | 0 | 3 | 3 expected roll(s) have no master file on disk |
| 519 | Master 1 | 3 | 0 | 3 | 3 expected roll(s) have no master file on disk |
| 520 | Master 1 | 1 | 0 | 1 | 1 expected roll(s) have no master file on disk |
| 521 | Master 1 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 522 | Master 1 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 523 | Master 1 | 0 | 0 | 0 | 4 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 525 | Master 1 | 2 | 0 | 2 | 2 expected roll(s) have no master file on disk |
| 526 | Master 1 | 2 | 0 | 2 | 2 expected roll(s) have no master file on disk |
| 527 | Master 1 | 1 | 0 | 1 | 1 expected roll(s) have no master file on disk |
| 529 | Master 1 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 530 | Master 1 | 4 | 0 | 4 | 4 expected roll(s) have no master file on disk; 4 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 531 | Master 1 | 0 | 0 | 0 | 5 shotlist row(s) on this tape have a blank identifier (unknown content); 1 non-archive identifier(s) on this tape (e.g. 28327) |
| 532 | Master 1 | 0 | 0 | 0 | 1 non-archive identifier(s) on this tape (e.g. 41770) |
| 533 | Master 1 | 0 | 0 | 0 | 5 non-archive identifier(s) on this tape (e.g. PPP 41, PPP19, PPP36) |
| 534 | Master 1 | 7 | 3 | 4 | 4 expected roll(s) have no master file on disk; 2 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 535 | Master 1 | 1 | 0 | 1 | 1 expected roll(s) have no master file on disk; 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 536 | Master 1 | 2 | 0 | 2 | 2 expected roll(s) have no master file on disk |
| 537 | Master 1 | 7 | 6 | 1 | 1 expected roll(s) have no master file on disk |
| 538 | Master 1 | 6 | 5 | 1 | 1 expected roll(s) have no master file on disk; 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 539 | Master 1 | 2 | 1 | 1 | 1 expected roll(s) have no master file on disk; 3 non-archive identifier(s) on this tape (e.g. 158.4, 173.1, 173.2) |
| 540 | Master 1 | 4 | 4 | 0 | 1 non-archive identifier(s) on this tape (e.g. 306.2) |
| 543 | Master 1 | 5 | 4 | 1 | 1 expected roll(s) have no master file on disk; 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 545 | Master 1 | 9 | 8 | 1 | 1 expected roll(s) have no master file on disk |
| 549 | Master 1 | 0 | 0 | 0 | 1 non-archive identifier(s) on this tape (e.g. 81781) |
| 551 | Master 1 | 5 | 1 | 4 | 4 expected roll(s) have no master file on disk; 1 shotlist row(s) on this tape have a blank identifier (unknown content); 2 non-archive identifier(s) on this tape (e.g. 31097 Reel 2, 342 USAF 42668 Reel 1) |
| 552 | Master 1 | 0 | 0 | 0 | 6 non-archive identifier(s) on this tape (e.g. 342 USAF 35015 Reel 2, 342 USAF 37016 Reel 1, 342 USAF 37839) |
| 553 | Master 1 | 1 | 0 | 1 | 1 expected roll(s) have no master file on disk; 1 shotlist row(s) on this tape have a blank identifier (unknown content); 1 non-archive identifier(s) on this tape (e.g. 306.7756) |
| 554 | Master 1 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 555 | Master 1 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 556 | Master 1 | 0 | 0 | 0 | 1 non-archive identifier(s) on this tape (e.g. 802325) |
| 557 | Master 1 | 0 | 0 | 0 | 1 non-archive identifier(s) on this tape (e.g. 802326) |
| 558 | Master 1 | 1 | 0 | 1 | 1 expected roll(s) have no master file on disk |
| 559 | Master 1 | 8 | 5 | 3 | 3 expected roll(s) have no master file on disk; 2 non-archive identifier(s) on this tape (e.g. 90 OM 298, 94-307) |
| 560 | Master 1 | 0 | 0 | 0 | 2 shotlist row(s) on this tape have a blank identifier (unknown content); 3 non-archive identifier(s) on this tape (e.g. O-13, O-266, OM-2359) |
| 562 | Master 1 | 5 | 4 | 1 | 1 expected roll(s) have no master file on disk |
| 563 | Master 2 | 6 | 6 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 564 | Master 2 | 8 | 7 | 1 | 1 expected roll(s) have no master file on disk |
| 567 | Master 2 | 9 | 9 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 568 | Master 2 | 6 | 5 | 1 | 1 expected roll(s) have no master file on disk |
| 569 | Master 2 | 7 | 6 | 1 | 1 expected roll(s) have no master file on disk |
| 572 | Master 2 | 7 | 6 | 1 | 1 expected roll(s) have no master file on disk |
| 576 | Master 2 | 4 | 4 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 578 | Master 2 | 5 | 0 | 5 | 5 expected roll(s) have no master file on disk; 1 non-archive identifier(s) on this tape (e.g. HQA 200) |
| 579 | Master 2 | 8 | 0 | 8 | 8 expected roll(s) have no master file on disk |
| 584 | Master 2 | 6 | 5 | 1 | 1 expected roll(s) have no master file on disk |
| 591 | Master 2 | 0 | 0 | 0 | 3 non-archive identifier(s) on this tape (e.g. 712293, 800736, 800776) |
| 592 | Master 2 | 0 | 0 | 0 | 1 non-archive identifier(s) on this tape (e.g. 800788) |
| 593 | Master 2 | 0 | 0 | 0 | 1 non-archive identifier(s) on this tape (e.g. 800720) |
| 594 | Master 2 | 0 | 0 | 0 | 1 non-archive identifier(s) on this tape (e.g. 800781) |
| 595 | Master 2 | 0 | 0 | 0 | 1 non-archive identifier(s) on this tape (e.g. 800782) |
| 596 | Master 2 | 0 | 0 | 0 | 1 non-archive identifier(s) on this tape (e.g. 800722) |
| 597 | Master 2 | 0 | 0 | 0 | 1 non-archive identifier(s) on this tape (e.g. 801415) |
| 598 | Master 2 | 0 | 0 | 0 | 1 non-archive identifier(s) on this tape (e.g. 800744) |
| 599 | Master 2 | 0 | 0 | 0 | 1 non-archive identifier(s) on this tape (e.g. 800719) |
| 600 | Master 2 | 0 | 0 | 0 | 1 non-archive identifier(s) on this tape (e.g. 802320) |
| 601 | Master 2 | 4 | 0 | 4 | 4 expected roll(s) have no master file on disk |
| 602 | Master 2 | 0 | 0 | 0 | 1 non-archive identifier(s) on this tape (e.g. 802280) |
| 603 | Master 2 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 604 | Master 2 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 606 | Master 2 | 5 | 5 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 608 | Master 2 | 5 | 5 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 610 | Master 2 | 4 | 3 | 1 | 1 expected roll(s) have no master file on disk |
| 611 | Master 2 | 16 | 0 | 16 | 16 expected roll(s) have no master file on disk; 1 non-archive identifier(s) on this tape (e.g. 255 AS-012) |
| 612 | Master 2 | 1 | 0 | 1 | 1 expected roll(s) have no master file on disk |
| 613 | Master 2 | 3 | 1 | 2 | 2 expected roll(s) have no master file on disk; 1 non-archive identifier(s) on this tape (e.g. 255 S) |
| 614 | Master 2 | 0 | 0 | 0 | 5 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 615 | Master 2 | 0 | 0 | 0 | 2 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 616 | Master 2 | 7 | 7 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 618 | Master 2 | 1 | 0 | 1 | 1 expected roll(s) have no master file on disk |
| 619 | Master 2 | 0 | 0 | 0 | 1 non-archive identifier(s) on this tape (e.g. USG: 15 Reel 1) |
| 620 | Master 2 | 6 | 1 | 5 | 5 expected roll(s) have no master file on disk |
| 622 | Master 2 | 6 | 4 | 2 | 2 expected roll(s) have no master file on disk |
| 627 | Master 3 | 4 | 1 | 3 | 3 expected roll(s) have no master file on disk; 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 628 | Master 3 | 8 | 8 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 629 | Master 3 | 3 | 0 | 3 | 3 expected roll(s) have no master file on disk |
| 630 | Master 3 | 7 | 0 | 7 | 7 expected roll(s) have no master file on disk |
| 631 | Master 3 | 8 | 0 | 8 | 8 expected roll(s) have no master file on disk; 1 non-archive identifier(s) on this tape (e.g. HQ-221A) |
| 632 | Master 3 | 1 | 0 | 1 | 1 expected roll(s) have no master file on disk |
| 633 | Master 3 | 1 | 0 | 1 | 1 expected roll(s) have no master file on disk |
| 636 | Master 3 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 637 | Master 3 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 638 | Master 3 | 1 | 0 | 1 | 1 expected roll(s) have no master file on disk |
| 639 | Master 3 | 3 | 0 | 3 | 3 expected roll(s) have no master file on disk |
| 640 | Master 3 | 5 | 5 | 0 | 1 non-archive identifier(s) on this tape (e.g. 80311) |
| 641 | Master 3 | 0 | 0 | 0 | 1 non-archive identifier(s) on this tape (e.g. 802174) |
| 643 | Master 3 | 0 | 0 | 0 | 1 non-archive identifier(s) on this tape (e.g. 800720) |
| 644 | Master 3 | 7 | 0 | 7 | 7 expected roll(s) have no master file on disk |
| 645 | Master 3 | 6 | 0 | 6 | 6 expected roll(s) have no master file on disk |
| 646 | Master 3 | 4 | 0 | 4 | 4 expected roll(s) have no master file on disk; 2 shotlist row(s) on this tape have a blank identifier (unknown content); 1 non-archive identifier(s) on this tape (e.g. 255-HQA-159) |
| 647 | Master 3 | 6 | 0 | 6 | 6 expected roll(s) have no master file on disk |
| 648 | Master 3 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 649 | Master 3 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 654 | Master 3 | 5 | 4 | 1 | 1 expected roll(s) have no master file on disk |
| 663 | Master 3 | 5 | 4 | 1 | 1 expected roll(s) have no master file on disk; 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 668 | Master 3 | 3 | 2 | 1 | 1 expected roll(s) have no master file on disk; 6 non-archive identifier(s) on this tape (e.g. 803016, 803101, 803104) |
| 669 | Master 3 | 2 | 2 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content); 3 non-archive identifier(s) on this tape (e.g. 803204, 803217, 803254) |
| 670 | Master 3 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 674 | Master 3 | 9 | 8 | 1 | 1 expected roll(s) have no master file on disk |
| 679 | Master 3 | 2 | 0 | 2 | 2 expected roll(s) have no master file on disk |
| 680 | Master 3 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 681 | Master 3 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 682 | Master 3 | 1 | 0 | 1 | 1 expected roll(s) have no master file on disk |
| 683 | Master 3 | 0 | 0 | 0 | 4 non-archive identifier(s) on this tape (e.g. MSFC E-16, MSFC E-72, MSFC E-77) |
| 684 | Master 3 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 690 | Master 3 | 0 | 0 | 0 | 1 non-archive identifier(s) on this tape (e.g. 803205) |
| 692 | Master 3 | 1 | 0 | 1 | 1 expected roll(s) have no master file on disk |
| 693 | Master 3 | 1 | 0 | 1 | 1 expected roll(s) have no master file on disk |
| 700 | Master 3 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 701 | Master 3 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 703 | Master 3 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 704 | Master 3 | 3 | 0 | 3 | 3 expected roll(s) have no master file on disk |
| 705 | Master 3 | 3 | 0 | 3 | 3 expected roll(s) have no master file on disk; 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 706 | Master 3 | 2 | 0 | 2 | 2 expected roll(s) have no master file on disk |
| 707 | Master 3 | 2 | 0 | 2 | 2 expected roll(s) have no master file on disk |
| 708 | Master 3 | 0 | 0 | 0 | 1 non-archive identifier(s) on this tape (e.g. 718918) |
| 709 | Master 3 | 1 | 0 | 1 | 1 expected roll(s) have no master file on disk |
| 713 | Master 4 | 0 | 0 | 0 | 1 non-archive identifier(s) on this tape (e.g. VJSC1425L) |
| 714 | Master 4 | 0 | 0 | 0 | 1 non-archive identifier(s) on this tape (e.g. 607009) |
| 715 | Master 4 | 0 | 0 | 0 | 1 non-archive identifier(s) on this tape (e.g. 608024) |
| 716 | Master 4 | 0 | 0 | 0 | 1 non-archive identifier(s) on this tape (e.g. 461702) |
| 717 | Master 4 | 0 | 0 | 0 | 2 non-archive identifier(s) on this tape (e.g. 461804, 461805) |
| 718 | Master 4 | 0 | 0 | 0 | 1 non-archive identifier(s) on this tape (e.g. 461826) |
| 719 | Master 4 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 720 | Master 4 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 721 | Master 4 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 722 | Master 4 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 723 | Master 4 | 0 | 0 | 0 | 4 non-archive identifier(s) on this tape (e.g. 0360-1M-S295-35Aa, 06270-4T-W415-I67, 06270-5T-W315-632) |
| 724 | Master 4 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 725 | Master 4 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 726 | Master 4 | 0 | 0 | 0 | 2 non-archive identifier(s) on this tape (e.g. 461920, 461924) |
| 727 | Master 4 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 728 | Master 4 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 729 | Master 4 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 731 | Master 4 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 744 | Master 4 | 1 | 0 | 1 | 1 expected roll(s) have no master file on disk |
| 747 | Master 4 | 1 | 0 | 1 | 1 expected roll(s) have no master file on disk |
| 748 | Master 4 | 1 | 0 | 1 | 1 expected roll(s) have no master file on disk |
| 754 | Master 4 | 1 | 0 | 1 | 1 expected roll(s) have no master file on disk |
| 756 | Master 4 | 0 | 0 | 0 | 3 non-archive identifier(s) on this tape (e.g. 719724, 722439, 732830) |
| 757 | Master 4 | 0 | 0 | 0 | 2 non-archive identifier(s) on this tape (e.g. 717558, 718299) |
| 758 | Master 4 | 0 | 0 | 0 | 1 non-archive identifier(s) on this tape (e.g. 720071) |
| 759 | Master 4 | 0 | 0 | 0 | 3 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 760 | Master 4 | 0 | 0 | 0 | 1 non-archive identifier(s) on this tape (e.g. 720301) |
| 761 | Master 4 | 0 | 0 | 0 | 1 non-archive identifier(s) on this tape (e.g. 720069) |
| 762 | Master 4 | 0 | 0 | 0 | 4 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 763 | Master 4 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 764 | Master 4 | 1 | 0 | 1 | 1 expected roll(s) have no master file on disk |
| 765 | Master 4 | 1 | 0 | 1 | 1 expected roll(s) have no master file on disk |
| 766 | Master 4 | 1 | 0 | 1 | 1 expected roll(s) have no master file on disk |
| 767 | Master 4 | 1 | 0 | 1 | 1 expected roll(s) have no master file on disk |
| 780 | Master 4 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 781 | Master 4 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 782 | Master 4 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 783 | Master 4 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 786 | Master 4 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 787 | Master 4 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 788 | Master 4 | 1 | 0 | 1 | 1 expected roll(s) have no master file on disk |
| 789 | Master 4 | 1 | 0 | 1 | 1 expected roll(s) have no master file on disk |
| 790 | Master 4 | 1 | 0 | 1 | 1 expected roll(s) have no master file on disk |
| 791 | Master 4 | 1 | 0 | 1 | 1 expected roll(s) have no master file on disk |
| 792 | Master 4 | 1 | 0 | 1 | 1 expected roll(s) have no master file on disk |
| 793 | Master 4 | 1 | 0 | 1 | 1 expected roll(s) have no master file on disk |
| 794 | Master 4 | 1 | 0 | 1 | 1 expected roll(s) have no master file on disk |
| 795 | Master 4 | 0 | 0 | 0 | 5 non-archive identifier(s) on this tape (e.g. 715916, 715953, 715966) |
| 796 | Master 4 | 0 | 0 | 0 | 1 non-archive identifier(s) on this tape (e.g. 734456) |
| 797 | Master 4 | 0 | 0 | 0 | 1 non-archive identifier(s) on this tape (e.g. 734457) |
| 798 | Master 4 | 0 | 0 | 0 | 1 non-archive identifier(s) on this tape (e.g. 734459) |
| 799 | Master 4 | 0 | 0 | 0 | 1 non-archive identifier(s) on this tape (e.g. 734458) |
| 800 | Master 4 | 0 | 0 | 0 | 4 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 801 | Master 4 | 0 | 0 | 0 | 1 non-archive identifier(s) on this tape (e.g. 734460) |
| 802 | Master 4 | 0 | 0 | 0 | 1 non-archive identifier(s) on this tape (e.g. 718356) |
| 803 | Master 4 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 804 | Master 4 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 805 | Master 4 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 806 | Master 4 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 808 | Master 4 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 809 | Master 4 | 0 | 0 | 0 | 5 non-archive identifier(s) on this tape (e.g. 117687, 117752, 117761) |
| 810 | Master 4 | 0 | 0 | 0 | 1 non-archive identifier(s) on this tape (e.g. 117712) |
| 813 | Master 4 | 1 | 0 | 1 | 1 expected roll(s) have no master file on disk |
| 814 | Master 4 | 1 | 0 | 1 | 1 expected roll(s) have no master file on disk |
| 815 | Master 4 | 1 | 0 | 1 | 1 expected roll(s) have no master file on disk |
| 816 | Master 4 | 1 | 0 | 1 | 1 expected roll(s) have no master file on disk |
| 817 | Master 4 | 1 | 0 | 1 | 1 expected roll(s) have no master file on disk |
| 818 | Master 4 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 819 | Master 4 | 1 | 0 | 1 | 1 expected roll(s) have no master file on disk; 1 non-archive identifier(s) on this tape (e.g. JSC1374D) |
| 823 | Master 4 | 1 | 0 | 1 | 1 expected roll(s) have no master file on disk |
| 828 | Master 4 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 832 | Master 4 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 833 | Master 4 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 835 | Master 4 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 837 | Master 4 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 839 | Master 4 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 840 | Master 4 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 845 | Master 4 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 847 | Master 4 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 850 | Master 4 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 859 | Master 4 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 860 | Master 4 | 1 | 0 | 1 | 1 expected roll(s) have no master file on disk |
| 861 | Master 4 | 1 | 0 | 1 | 1 expected roll(s) have no master file on disk |
| 862 | Master 4 | 1 | 0 | 1 | 1 expected roll(s) have no master file on disk |
| 864 | Master 4 | 1 | 0 | 1 | 1 expected roll(s) have no master file on disk |
| 867 | Master 4 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 873 | Master 4 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 874 | Master 4 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 875 | Master 4 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 876 | Master 4 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 877 | Master 4 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 878 | Master 4 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 879 | Master 4 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 880 | Master 4 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 882 | Master 4 | 0 | 0 | 0 | 4 non-archive identifier(s) on this tape (e.g. 502373, 506620, 715807) |
| 883 | Master 4 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 884 | Master 4 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 885 | Master 4 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 886 | Master 4 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |

### Detail per kept tape

#### Tape 501 — `Master 1/Tape 501 - Self Contained.mov`

- Expected rolls: **3**, on disk: **0**, missing: **3**
- Missing rolls (3):
  - `FR-7404`
  - `FR-7405`
  - `FR-7406`

#### Tape 502 — `Master 1/Tape 502 - Self Contained.mov`

- Expected rolls: **2**, on disk: **0**, missing: **2**
- Missing rolls (2):
  - `FR-7407`
  - `FR-8033`

#### Tape 503 — `Master 1/Tape 503 - Self Contained.mov`

- Expected rolls: **2**, on disk: **0**, missing: **2**
- Missing rolls (2):
  - `FR-8782`
  - `FR-9361`

#### Tape 504 — `Master 1/Tape 504 - Self Contained.mov`

- Expected rolls: **3**, on disk: **1**, missing: **2**
- Missing rolls (2):
  - `FR-5750`
  - `FR-6743`

#### Tape 505 — `Master 1/Tape 505 - Self Contained.mov`

- Expected rolls: **4**, on disk: **0**, missing: **4**
- Missing rolls (4):
  - `JSC-0091`
  - `JSC-0094`
  - `JSC-0119`
  - `JSC-0124`
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 506 — `Master 1/Tape 506 - Self Contained.mov`

- Expected rolls: **4**, on disk: **0**, missing: **4**
- Missing rolls (4):
  - `HQ-0194`
  - `JSC-0097`
  - `JSC-0277`
  - `JSC-0326`

#### Tape 507 — `Master 1/Tape 507 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 508 — `Master 1/Tape 508 - Self Contained.mov`

- Expected rolls: **8**, on disk: **8**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 509 — `Master 1/Tape 509 - Self Contained.mov`

- Expected rolls: **5**, on disk: **5**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 510 — `Master 1/Tape 510 - Self Contained.mov`

- Expected rolls: **5**, on disk: **4**, missing: **1**
- Missing rolls (1):
  - `FR-0737`

#### Tape 511 — `Master 1/Tape 511 - Self Contained.mov`

- Expected rolls: **8**, on disk: **7**, missing: **1**
- Missing rolls (1):
  - `FR-0231`

#### Tape 514 — `Master 1/Tape 514 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 2 (unknown content on this tape)
- Non-archive identifiers on this tape: `802260`, `: Mag 198`, `Can 01`, `Can 02 Item 07 : Mag 11-23`, `Can 3`, `HD`, `Item 08`, `Item 09 : Mag S-66 535`, `Item 1`, `Mag S-65-4`

#### Tape 515 — `Master 1/Tape 515 - Self Contained.mov`

- Expected rolls: **5**, on disk: **1**, missing: **4**
- Missing rolls (4):
  - `FR-5082`
  - `FR-5084`
  - `FR-5140`
  - `FR-5452`
- Shotlist rows with blank identifier: 2 (unknown content on this tape)
- Non-archive identifiers on this tape: `802262`

#### Tape 516 — `Master 1/Tape 516 - Self Contained.mov`

- Expected rolls: **4**, on disk: **1**, missing: **3**
- Missing rolls (3):
  - `FR-5453`
  - `FR-5576`
  - `FR-5719`
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 517 — `Master 1/Tape 517 - Self Contained.mov`

- Expected rolls: **5**, on disk: **0**, missing: **5**
- Missing rolls (5):
  - `FR-A794`
  - `FR-A795`
  - `FR-A796`
  - `FR-A797`
  - `FR-A798`

#### Tape 518 — `Master 1/Tape 518 - Self Contained.mov`

- Expected rolls: **3**, on disk: **0**, missing: **3**
- Missing rolls (3):
  - `FR-9805`
  - `FR-9866`
  - `FR-9870`

#### Tape 519 — `Master 1/Tape 519 - Self Contained.mov`

- Expected rolls: **3**, on disk: **0**, missing: **3**
- Missing rolls (3):
  - `FR-5993`
  - `FR-A354`
  - `FR-A794`

#### Tape 520 — `Master 1/Tape 520 - Self Contained.mov`

- Expected rolls: **1**, on disk: **0**, missing: **1**
- Missing rolls (1):
  - `FR-9864`

#### Tape 521 — `Master 1/Tape 521 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 522 — `Master 1/Tape 522 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 523 — `Master 1/Tape 523 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 4 (unknown content on this tape)

#### Tape 525 — `Master 1/Tape 525 - Self Contained.mov`

- Expected rolls: **2**, on disk: **0**, missing: **2**
- Missing rolls (2):
  - `FR-A092`
  - `FR-A093`

#### Tape 526 — `Master 1/Tape 526 - Self Contained.mov`

- Expected rolls: **2**, on disk: **0**, missing: **2**
- Missing rolls (2):
  - `FR-A094`
  - `FR-A095`

#### Tape 527 — `Master 1/Tape 527 - Self Contained.mov`

- Expected rolls: **1**, on disk: **0**, missing: **1**
- Missing rolls (1):
  - `FR-A355`

#### Tape 529 — `Master 1/Tape 529 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 530 — `Master 1/Tape 530 - Self Contained.mov`

- Expected rolls: **4**, on disk: **0**, missing: **4**
- Missing rolls (4):
  - `HQ-47`
  - `S-1031`
  - `S-1109`
  - `S-4329`
- Shotlist rows with blank identifier: 4 (unknown content on this tape)

#### Tape 531 — `Master 1/Tape 531 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 5 (unknown content on this tape)
- Non-archive identifiers on this tape: `28327`

#### Tape 532 — `Master 1/Tape 532 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Non-archive identifiers on this tape: `41770`

#### Tape 533 — `Master 1/Tape 533 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Non-archive identifiers on this tape: `PPP 41`, `PPP19`, `PPP36`, `USG 15`, `WHN 15`

#### Tape 534 — `Master 1/Tape 534 - Self Contained.mov`

- Expected rolls: **7**, on disk: **3**, missing: **4**
- Missing rolls (4):
  - `FR-7075`
  - `FR-7106`
  - `FR-8052`
  - `FR-8058`
- Shotlist rows with blank identifier: 2 (unknown content on this tape)

#### Tape 535 — `Master 1/Tape 535 - Self Contained.mov`

- Expected rolls: **1**, on disk: **0**, missing: **1**
- Missing rolls (1):
  - `FR-9026`
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 536 — `Master 1/Tape 536 - Self Contained.mov`

- Expected rolls: **2**, on disk: **0**, missing: **2**
- Missing rolls (2):
  - `FR-9537`
  - `FR-9538`

#### Tape 537 — `Master 1/Tape 537 - Self Contained.mov`

- Expected rolls: **7**, on disk: **6**, missing: **1**
- Missing rolls (1):
  - `FR-4653`

#### Tape 538 — `Master 1/Tape 538 - Self Contained.mov`

- Expected rolls: **6**, on disk: **5**, missing: **1**
- Missing rolls (1):
  - `JSC-63-143`
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 539 — `Master 1/Tape 539 - Self Contained.mov`

- Expected rolls: **2**, on disk: **1**, missing: **1**
- Missing rolls (1):
  - `JSC-307`
- Non-archive identifiers on this tape: `158.4`, `173.1`, `173.2`

#### Tape 540 — `Master 1/Tape 540 - Self Contained.mov`

- Expected rolls: **4**, on disk: **4**, missing: **0**
- Non-archive identifiers on this tape: `306.2`

#### Tape 543 — `Master 1/Tape 543 - Self Contained.mov`

- Expected rolls: **5**, on disk: **4**, missing: **1**
- Missing rolls (1):
  - `JSC-127`
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 545 — `Master 1/Tape 545 - Self Contained.mov`

- Expected rolls: **9**, on disk: **8**, missing: **1**
- Missing rolls (1):
  - `FR-7615`

#### Tape 549 — `Master 1/Tape 549 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Non-archive identifiers on this tape: `81781`

#### Tape 551 — `Master 1/Tape 551 - Self Contained.mov`

- Expected rolls: **5**, on disk: **1**, missing: **4**
- Missing rolls (4):
  - `S-02235`
  - `S-1915`
  - `S-2357`
  - `S-9096`
- Shotlist rows with blank identifier: 1 (unknown content on this tape)
- Non-archive identifiers on this tape: `31097 Reel 2`, `342 USAF 42668 Reel 1`

#### Tape 552 — `Master 1/Tape 552 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Non-archive identifiers on this tape: `342 USAF 35015 Reel 2`, `342 USAF 37016 Reel 1`, `342 USAF 37839`, `342 USAF 39925`, `342 USAF 40696`, `342 USF 42668 Reel 2`

#### Tape 553 — `Master 1/Tape 553 - Self Contained.mov`

- Expected rolls: **1**, on disk: **0**, missing: **1**
- Missing rolls (1):
  - `S-2169`
- Shotlist rows with blank identifier: 1 (unknown content on this tape)
- Non-archive identifiers on this tape: `306.7756`

#### Tape 554 — `Master 1/Tape 554 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 555 — `Master 1/Tape 555 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 556 — `Master 1/Tape 556 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Non-archive identifiers on this tape: `802325`

#### Tape 557 — `Master 1/Tape 557 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Non-archive identifiers on this tape: `802326`

#### Tape 558 — `Master 1/Tape 558 - Self Contained.mov`

- Expected rolls: **1**, on disk: **0**, missing: **1**
- Missing rolls (1):
  - `FR-9930`

#### Tape 559 — `Master 1/Tape 559 - Self Contained.mov`

- Expected rolls: **8**, on disk: **5**, missing: **3**
- Missing rolls (3):
  - `KSC-69-71230`
  - `KSC-69-71231`
  - `MFC-79-439`
- Non-archive identifiers on this tape: `90 OM 298`, `94-307`

#### Tape 560 — `Master 1/Tape 560 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 2 (unknown content on this tape)
- Non-archive identifiers on this tape: `O-13`, `O-266`, `OM-2359`

#### Tape 562 — `Master 1/Tape 562 - Self Contained.mov`

- Expected rolls: **5**, on disk: **4**, missing: **1**
- Missing rolls (1):
  - `FR-7268`

#### Tape 563 — `Master 2/Tape 563 - Self Contained.mov`

- Expected rolls: **6**, on disk: **6**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 564 — `Master 2/Tape 564 - Self Contained.mov`

- Expected rolls: **8**, on disk: **7**, missing: **1**
- Missing rolls (1):
  - `FR-7802`

#### Tape 567 — `Master 2/Tape 567 - Self Contained.mov`

- Expected rolls: **9**, on disk: **9**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 568 — `Master 2/Tape 568 - Self Contained.mov`

- Expected rolls: **6**, on disk: **5**, missing: **1**
- Missing rolls (1):
  - `FR-8697`

#### Tape 569 — `Master 2/Tape 569 - Self Contained.mov`

- Expected rolls: **7**, on disk: **6**, missing: **1**
- Missing rolls (1):
  - `FR-8958`

#### Tape 572 — `Master 2/Tape 572 - Self Contained.mov`

- Expected rolls: **7**, on disk: **6**, missing: **1**
- Missing rolls (1):
  - `FR-2128`

#### Tape 576 — `Master 2/Tape 576 - Self Contained.mov`

- Expected rolls: **4**, on disk: **4**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 578 — `Master 2/Tape 578 - Self Contained.mov`

- Expected rolls: **5**, on disk: **0**, missing: **5**
- Missing rolls (5):
  - `HQ-167`
  - `HQ-188`
  - `HQ-88`
  - `HQ-A173`
  - `S-1774`
- Non-archive identifiers on this tape: `HQA 200`

#### Tape 579 — `Master 2/Tape 579 - Self Contained.mov`

- Expected rolls: **8**, on disk: **0**, missing: **8**
- Missing rolls (8):
  - `S-02091`
  - `S-02696`
  - `S-02765`
  - `S-1628`
  - `S-1771`
  - `S-2124`
  - `S-2766`
  - `S-9086`

#### Tape 584 — `Master 2/Tape 584 - Self Contained.mov`

- Expected rolls: **6**, on disk: **5**, missing: **1**
- Missing rolls (1):
  - `FR-D619`

#### Tape 591 — `Master 2/Tape 591 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Non-archive identifiers on this tape: `712293`, `800736`, `800776`

#### Tape 592 — `Master 2/Tape 592 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Non-archive identifiers on this tape: `800788`

#### Tape 593 — `Master 2/Tape 593 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Non-archive identifiers on this tape: `800720`

#### Tape 594 — `Master 2/Tape 594 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Non-archive identifiers on this tape: `800781`

#### Tape 595 — `Master 2/Tape 595 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Non-archive identifiers on this tape: `800782`

#### Tape 596 — `Master 2/Tape 596 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Non-archive identifiers on this tape: `800722`

#### Tape 597 — `Master 2/Tape 597 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Non-archive identifiers on this tape: `801415`

#### Tape 598 — `Master 2/Tape 598 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Non-archive identifiers on this tape: `800744`

#### Tape 599 — `Master 2/Tape 599 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Non-archive identifiers on this tape: `800719`

#### Tape 600 — `Master 2/Tape 600 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Non-archive identifiers on this tape: `802320`

#### Tape 601 — `Master 2/Tape 601 - Self Contained.mov`

- Expected rolls: **4**, on disk: **0**, missing: **4**
- Missing rolls (4):
  - `S-67-506`
  - `S-67-533`
  - `S-67-545`
  - `S-67-600`

#### Tape 602 — `Master 2/Tape 602 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Non-archive identifiers on this tape: `802280`

#### Tape 603 — `Master 2/Tape 603 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 604 — `Master 2/Tape 604 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 606 — `Master 2/Tape 606 - Self Contained.mov`

- Expected rolls: **5**, on disk: **5**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 608 — `Master 2/Tape 608 - Self Contained.mov`

- Expected rolls: **5**, on disk: **5**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 610 — `Master 2/Tape 610 - Self Contained.mov`

- Expected rolls: **4**, on disk: **3**, missing: **1**
- Missing rolls (1):
  - `FR-4685`

#### Tape 611 — `Master 2/Tape 611 - Self Contained.mov`

- Expected rolls: **16**, on disk: **0**, missing: **16**
- Missing rolls (16):
  - `ASR-004`
  - `ASR-010`
  - `ASR-011`
  - `ASR-018`
  - `ASR-044`
  - `ASR-046`
  - `ASR-048`
  - `ASR-07`
  - `ASR-08`
  - `ASR-203`
  - `ASR-21`
  - `ASR-33`
  - `ASR-35`
  - `ASR-50`
  - `ASR-52`
  - `ASR-54`
- Non-archive identifiers on this tape: `255 AS-012`

#### Tape 612 — `Master 2/Tape 612 - Self Contained.mov`

- Expected rolls: **1**, on disk: **0**, missing: **1**
- Missing rolls (1):
  - `HQ-183`

#### Tape 613 — `Master 2/Tape 613 - Self Contained.mov`

- Expected rolls: **3**, on disk: **1**, missing: **2**
- Missing rolls (2):
  - `S-4302`
  - `S-4430`
- Non-archive identifiers on this tape: `255 S`

#### Tape 614 — `Master 2/Tape 614 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 5 (unknown content on this tape)

#### Tape 615 — `Master 2/Tape 615 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 2 (unknown content on this tape)

#### Tape 616 — `Master 2/Tape 616 - Self Contained.mov`

- Expected rolls: **7**, on disk: **7**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 618 — `Master 2/Tape 618 - Self Contained.mov`

- Expected rolls: **1**, on disk: **0**, missing: **1**
- Missing rolls (1):
  - `ASR-01`

#### Tape 619 — `Master 2/Tape 619 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Non-archive identifiers on this tape: `USG: 15 Reel 1`

#### Tape 620 — `Master 2/Tape 620 - Self Contained.mov`

- Expected rolls: **6**, on disk: **1**, missing: **5**
- Missing rolls (5):
  - `FR-8221`
  - `FR-8227`
  - `FR-8442`
  - `FR-8924`
  - `JSC-0623`

#### Tape 622 — `Master 2/Tape 622 - Self Contained.mov`

- Expected rolls: **6**, on disk: **4**, missing: **2**
- Missing rolls (2):
  - `FR-9737`
  - `FR-9972`

#### Tape 627 — `Master 3/Tape 627 - Self Contained.mov`

- Expected rolls: **4**, on disk: **1**, missing: **3**
- Missing rolls (3):
  - `JSC-344`
  - `JSC-509`
  - `MSC-64-232`
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 628 — `Master 3/Tape 628 - Self Contained.mov`

- Expected rolls: **8**, on disk: **8**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 629 — `Master 3/Tape 629 - Self Contained.mov`

- Expected rolls: **3**, on disk: **0**, missing: **3**
- Missing rolls (3):
  - `FR-4817`
  - `FR-4834`
  - `FR-4843`

#### Tape 630 — `Master 3/Tape 630 - Self Contained.mov`

- Expected rolls: **7**, on disk: **0**, missing: **7**
- Missing rolls (7):
  - `S-6342`
  - `S-6360`
  - `S-6473`
  - `S-6555`
  - `S-6757`
  - `S-6866`
  - `S-6873`

#### Tape 631 — `Master 3/Tape 631 - Self Contained.mov`

- Expected rolls: **8**, on disk: **0**, missing: **8**
- Missing rolls (8):
  - `ASR-174`
  - `ASR-64`
  - `S-8109`
  - `S-8474`
  - `S-8649`
  - `S-8659`
  - `S-8841`
  - `S-8954`
- Non-archive identifiers on this tape: `HQ-221A`

#### Tape 632 — `Master 3/Tape 632 - Self Contained.mov`

- Expected rolls: **1**, on disk: **0**, missing: **1**
- Missing rolls (1):
  - `S-8500`

#### Tape 633 — `Master 3/Tape 633 - Self Contained.mov`

- Expected rolls: **1**, on disk: **0**, missing: **1**
- Missing rolls (1):
  - `S-9232`

#### Tape 636 — `Master 3/Tape 636 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 637 — `Master 3/Tape 637 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 638 — `Master 3/Tape 638 - Self Contained.mov`

- Expected rolls: **1**, on disk: **0**, missing: **1**
- Missing rolls (1):
  - `S-4598`

#### Tape 639 — `Master 3/Tape 639 - Self Contained.mov`

- Expected rolls: **3**, on disk: **0**, missing: **3**
- Missing rolls (3):
  - `S-2141`
  - `S-4578`
  - `S-4596`

#### Tape 640 — `Master 3/Tape 640 - Self Contained.mov`

- Expected rolls: **5**, on disk: **5**, missing: **0**
- Non-archive identifiers on this tape: `80311`

#### Tape 641 — `Master 3/Tape 641 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Non-archive identifiers on this tape: `802174`

#### Tape 643 — `Master 3/Tape 643 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Non-archive identifiers on this tape: `800720`

#### Tape 644 — `Master 3/Tape 644 - Self Contained.mov`

- Expected rolls: **7**, on disk: **0**, missing: **7**
- Missing rolls (7):
  - `ASR-05`
  - `ASR-125`
  - `ASR-51`
  - `ASR-74`
  - `ASR-80`
  - `ASR-91`
  - `S-9165`

#### Tape 645 — `Master 3/Tape 645 - Self Contained.mov`

- Expected rolls: **6**, on disk: **0**, missing: **6**
- Missing rolls (6):
  - `ASR-176`
  - `S-5511`
  - `S-5517`
  - `S-5518`
  - `S-6296`
  - `S-8236`

#### Tape 646 — `Master 3/Tape 646 - Self Contained.mov`

- Expected rolls: **4**, on disk: **0**, missing: **4**
- Missing rolls (4):
  - `S-7155`
  - `S-8519`
  - `S-8530`
  - `S-9161`
- Shotlist rows with blank identifier: 2 (unknown content on this tape)
- Non-archive identifiers on this tape: `255-HQA-159`

#### Tape 647 — `Master 3/Tape 647 - Self Contained.mov`

- Expected rolls: **6**, on disk: **0**, missing: **6**
- Missing rolls (6):
  - `S-4535`
  - `S-4536`
  - `S-4584`
  - `S-4990`
  - `S-5411`
  - `S-5510`

#### Tape 648 — `Master 3/Tape 648 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 649 — `Master 3/Tape 649 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 654 — `Master 3/Tape 654 - Self Contained.mov`

- Expected rolls: **5**, on disk: **4**, missing: **1**
- Missing rolls (1):
  - `JSC-346`

#### Tape 663 — `Master 3/Tape 663 - Self Contained.mov`

- Expected rolls: **5**, on disk: **4**, missing: **1**
- Missing rolls (1):
  - `FR-7423`
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 668 — `Master 3/Tape 668 - Self Contained.mov`

- Expected rolls: **3**, on disk: **2**, missing: **1**
- Missing rolls (1):
  - `FR-B434`
- Non-archive identifiers on this tape: `803016`, `803101`, `803104`, `803105`, `803115`, `803125`

#### Tape 669 — `Master 3/Tape 669 - Self Contained.mov`

- Expected rolls: **2**, on disk: **2**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)
- Non-archive identifiers on this tape: `803204`, `803217`, `803254`

#### Tape 670 — `Master 3/Tape 670 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 674 — `Master 3/Tape 674 - Self Contained.mov`

- Expected rolls: **9**, on disk: **8**, missing: **1**
- Missing rolls (1):
  - `FR-9542`

#### Tape 679 — `Master 3/Tape 679 - Self Contained.mov`

- Expected rolls: **2**, on disk: **0**, missing: **2**
- Missing rolls (2):
  - `JSC-572`
  - `JSC-603`

#### Tape 680 — `Master 3/Tape 680 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 681 — `Master 3/Tape 681 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 682 — `Master 3/Tape 682 - Self Contained.mov`

- Expected rolls: **1**, on disk: **0**, missing: **1**
- Missing rolls (1):
  - `JSC-580`

#### Tape 683 — `Master 3/Tape 683 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Non-archive identifiers on this tape: `MSFC E-16`, `MSFC E-72`, `MSFC E-77`, `MSFC E-8`

#### Tape 684 — `Master 3/Tape 684 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 690 — `Master 3/Tape 690 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Non-archive identifiers on this tape: `803205`

#### Tape 692 — `Master 3/Tape 692 - Self Contained.mov`

- Expected rolls: **1**, on disk: **0**, missing: **1**
- Missing rolls (1):
  - `JSC-2088`

#### Tape 693 — `Master 3/Tape 693 - Self Contained.mov`

- Expected rolls: **1**, on disk: **0**, missing: **1**
- Missing rolls (1):
  - `CL-1525`

#### Tape 700 — `Master 3/Tape 700 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 701 — `Master 3/Tape 701 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 703 — `Master 3/Tape 703 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 704 — `Master 3/Tape 704 - Self Contained.mov`

- Expected rolls: **3**, on disk: **0**, missing: **3**
- Missing rolls (3):
  - `AK-015`
  - `AK-016`
  - `AK-017`

#### Tape 705 — `Master 3/Tape 705 - Self Contained.mov`

- Expected rolls: **3**, on disk: **0**, missing: **3**
- Missing rolls (3):
  - `AK-018`
  - `AK-019`
  - `AK-020`
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 706 — `Master 3/Tape 706 - Self Contained.mov`

- Expected rolls: **2**, on disk: **0**, missing: **2**
- Missing rolls (2):
  - `AK-013`
  - `AK-014`

#### Tape 707 — `Master 3/Tape 707 - Self Contained.mov`

- Expected rolls: **2**, on disk: **0**, missing: **2**
- Missing rolls (2):
  - `AK-037`
  - `AK-038`

#### Tape 708 — `Master 3/Tape 708 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Non-archive identifiers on this tape: `718918`

#### Tape 709 — `Master 3/Tape 709 - Self Contained.mov`

- Expected rolls: **1**, on disk: **0**, missing: **1**
- Missing rolls (1):
  - `VJSC-960`

#### Tape 713 — `Master 4/Tape 713 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Non-archive identifiers on this tape: `VJSC1425L`

#### Tape 714 — `Master 4/Tape 714 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Non-archive identifiers on this tape: `607009`

#### Tape 715 — `Master 4/Tape 715 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Non-archive identifiers on this tape: `608024`

#### Tape 716 — `Master 4/Tape 716 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Non-archive identifiers on this tape: `461702`

#### Tape 717 — `Master 4/Tape 717 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Non-archive identifiers on this tape: `461804`, `461805`

#### Tape 718 — `Master 4/Tape 718 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Non-archive identifiers on this tape: `461826`

#### Tape 719 — `Master 4/Tape 719 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 720 — `Master 4/Tape 720 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 721 — `Master 4/Tape 721 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 722 — `Master 4/Tape 722 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 723 — `Master 4/Tape 723 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Non-archive identifiers on this tape: `0360-1M-S295-35Aa`, `06270-4T-W415-I67`, `06270-5T-W315-632`, `0660-2T-S647-237b&c`

#### Tape 724 — `Master 4/Tape 724 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 725 — `Master 4/Tape 725 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 726 — `Master 4/Tape 726 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Non-archive identifiers on this tape: `461920`, `461924`

#### Tape 727 — `Master 4/Tape 727 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 728 — `Master 4/Tape 728 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 729 — `Master 4/Tape 729 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 731 — `Master 4/Tape 731 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 744 — `Master 4/Tape 744 - Self Contained.mov`

- Expected rolls: **1**, on disk: **0**, missing: **1**
- Missing rolls (1):
  - `JSC-1962`

#### Tape 747 — `Master 4/Tape 747 - Self Contained.mov`

- Expected rolls: **1**, on disk: **0**, missing: **1**
- Missing rolls (1):
  - `JSC-1969`

#### Tape 748 — `Master 4/Tape 748 - Self Contained.mov`

- Expected rolls: **1**, on disk: **0**, missing: **1**
- Missing rolls (1):
  - `CMP-662`

#### Tape 754 — `Master 4/Tape 754 - Self Contained.mov`

- Expected rolls: **1**, on disk: **0**, missing: **1**
- Missing rolls (1):
  - `FR-0596`

#### Tape 756 — `Master 4/Tape 756 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Non-archive identifiers on this tape: `719724`, `722439`, `732830`

#### Tape 757 — `Master 4/Tape 757 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Non-archive identifiers on this tape: `717558`, `718299`

#### Tape 758 — `Master 4/Tape 758 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Non-archive identifiers on this tape: `720071`

#### Tape 759 — `Master 4/Tape 759 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 3 (unknown content on this tape)

#### Tape 760 — `Master 4/Tape 760 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Non-archive identifiers on this tape: `720301`

#### Tape 761 — `Master 4/Tape 761 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Non-archive identifiers on this tape: `720069`

#### Tape 762 — `Master 4/Tape 762 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 4 (unknown content on this tape)

#### Tape 763 — `Master 4/Tape 763 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 764 — `Master 4/Tape 764 - Self Contained.mov`

- Expected rolls: **1**, on disk: **0**, missing: **1**
- Missing rolls (1):
  - `VJSC-1395-2`

#### Tape 765 — `Master 4/Tape 765 - Self Contained.mov`

- Expected rolls: **1**, on disk: **0**, missing: **1**
- Missing rolls (1):
  - `VJSC-1395-1`

#### Tape 766 — `Master 4/Tape 766 - Self Contained.mov`

- Expected rolls: **1**, on disk: **0**, missing: **1**
- Missing rolls (1):
  - `VJSC-1168`

#### Tape 767 — `Master 4/Tape 767 - Self Contained.mov`

- Expected rolls: **1**, on disk: **0**, missing: **1**
- Missing rolls (1):
  - `JSC-1501`

#### Tape 780 — `Master 4/Tape 780 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 781 — `Master 4/Tape 781 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 782 — `Master 4/Tape 782 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 783 — `Master 4/Tape 783 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 786 — `Master 4/Tape 786 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 787 — `Master 4/Tape 787 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 788 — `Master 4/Tape 788 - Self Contained.mov`

- Expected rolls: **1**, on disk: **0**, missing: **1**
- Missing rolls (1):
  - `JSC-1632`

#### Tape 789 — `Master 4/Tape 789 - Self Contained.mov`

- Expected rolls: **1**, on disk: **0**, missing: **1**
- Missing rolls (1):
  - `JSC-1814`

#### Tape 790 — `Master 4/Tape 790 - Self Contained.mov`

- Expected rolls: **1**, on disk: **0**, missing: **1**
- Missing rolls (1):
  - `JSC-1814`

#### Tape 791 — `Master 4/Tape 791 - Self Contained.mov`

- Expected rolls: **1**, on disk: **0**, missing: **1**
- Missing rolls (1):
  - `JSC-1916`

#### Tape 792 — `Master 4/Tape 792 - Self Contained.mov`

- Expected rolls: **1**, on disk: **0**, missing: **1**
- Missing rolls (1):
  - `JSC-1916`

#### Tape 793 — `Master 4/Tape 793 - Self Contained.mov`

- Expected rolls: **1**, on disk: **0**, missing: **1**
- Missing rolls (1):
  - `JSC-1916`

#### Tape 794 — `Master 4/Tape 794 - Self Contained.mov`

- Expected rolls: **1**, on disk: **0**, missing: **1**
- Missing rolls (1):
  - `JSC-1916`

#### Tape 795 — `Master 4/Tape 795 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Non-archive identifiers on this tape: `715916`, `715953`, `715966`, `718356`, `718904`

#### Tape 796 — `Master 4/Tape 796 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Non-archive identifiers on this tape: `734456`

#### Tape 797 — `Master 4/Tape 797 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Non-archive identifiers on this tape: `734457`

#### Tape 798 — `Master 4/Tape 798 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Non-archive identifiers on this tape: `734459`

#### Tape 799 — `Master 4/Tape 799 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Non-archive identifiers on this tape: `734458`

#### Tape 800 — `Master 4/Tape 800 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 4 (unknown content on this tape)

#### Tape 801 — `Master 4/Tape 801 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Non-archive identifiers on this tape: `734460`

#### Tape 802 — `Master 4/Tape 802 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Non-archive identifiers on this tape: `718356`

#### Tape 803 — `Master 4/Tape 803 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 804 — `Master 4/Tape 804 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 805 — `Master 4/Tape 805 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 806 — `Master 4/Tape 806 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 808 — `Master 4/Tape 808 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 809 — `Master 4/Tape 809 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Non-archive identifiers on this tape: `117687`, `117752`, `117761`, `117780`, `117784`

#### Tape 810 — `Master 4/Tape 810 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Non-archive identifiers on this tape: `117712`

#### Tape 813 — `Master 4/Tape 813 - Self Contained.mov`

- Expected rolls: **1**, on disk: **0**, missing: **1**
- Missing rolls (1):
  - `FR-G94-001`

#### Tape 814 — `Master 4/Tape 814 - Self Contained.mov`

- Expected rolls: **1**, on disk: **0**, missing: **1**
- Missing rolls (1):
  - `FR-G90-001`

#### Tape 815 — `Master 4/Tape 815 - Self Contained.mov`

- Expected rolls: **1**, on disk: **0**, missing: **1**
- Missing rolls (1):
  - `FR-G90-006`

#### Tape 816 — `Master 4/Tape 816 - Self Contained.mov`

- Expected rolls: **1**, on disk: **0**, missing: **1**
- Missing rolls (1):
  - `FR-G90-012`

#### Tape 817 — `Master 4/Tape 817 - Self Contained.mov`

- Expected rolls: **1**, on disk: **0**, missing: **1**
- Missing rolls (1):
  - `FR-G89-003`

#### Tape 818 — `Master 4/Tape 818 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 819 — `Master 4/Tape 819 - Self Contained.mov`

- Expected rolls: **1**, on disk: **0**, missing: **1**
- Missing rolls (1):
  - `JSC1374D`
- Non-archive identifiers on this tape: `JSC1374D`

#### Tape 823 — `Master 4/Tape 823 - Self Contained.mov`

- Expected rolls: **1**, on disk: **0**, missing: **1**
- Missing rolls (1):
  - `JSC-1906`

#### Tape 828 — `Master 4/Tape 828 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 832 — `Master 4/Tape 832 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 833 — `Master 4/Tape 833 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 835 — `Master 4/Tape 835 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 837 — `Master 4/Tape 837 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 839 — `Master 4/Tape 839 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 840 — `Master 4/Tape 840 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 845 — `Master 4/Tape 845 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 847 — `Master 4/Tape 847 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 850 — `Master 4/Tape 850 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 859 — `Master 4/Tape 859 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 860 — `Master 4/Tape 860 - Self Contained.mov`

- Expected rolls: **1**, on disk: **0**, missing: **1**
- Missing rolls (1):
  - `JSC-1625`

#### Tape 861 — `Master 4/Tape 861 - Self Contained.mov`

- Expected rolls: **1**, on disk: **0**, missing: **1**
- Missing rolls (1):
  - `JSC-1648`

#### Tape 862 — `Master 4/Tape 862 - Self Contained.mov`

- Expected rolls: **1**, on disk: **0**, missing: **1**
- Missing rolls (1):
  - `JSC-1832`

#### Tape 864 — `Master 4/Tape 864 - Self Contained.mov`

- Expected rolls: **1**, on disk: **0**, missing: **1**
- Missing rolls (1):
  - `JSC-1660`

#### Tape 867 — `Master 4/Tape 867 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 873 — `Master 4/Tape 873 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 874 — `Master 4/Tape 874 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 875 — `Master 4/Tape 875 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 876 — `Master 4/Tape 876 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 877 — `Master 4/Tape 877 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 878 — `Master 4/Tape 878 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 879 — `Master 4/Tape 879 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 880 — `Master 4/Tape 880 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 882 — `Master 4/Tape 882 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Non-archive identifiers on this tape: `502373`, `506620`, `715807`, `715996`

#### Tape 883 — `Master 4/Tape 883 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 884 — `Master 4/Tape 884 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 885 — `Master 4/Tape 885 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 886 — `Master 4/Tape 886 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

## Unparseable Master Filenames

These files in the scan roots could not be matched to a film-roll identifier and were not used to satisfy any tape's coverage. Review them manually.

- `FR-Masters/Apollo 11/002 - Apollo 11 - Film Flight.mov`
- `FR-Masters/Apollo 13/111-DD-59-70.mov`
- `FR-Masters/Apollo 13/255-AD-31.mov`
- `FR-Masters/Apollo 13/255-AD-33.mov`
- `FR-Masters/Apollo 13/255-DEL-80.mov`
- `FR-Masters/Apollo 13/255-HQA-200.mov`
- `FR-Masters/Apollo 13/255-NR-70-892-R12.mov`
- `FR-Masters/Apollo 13/255-NR-70-892-R14.mov`
- `FR-Masters/Apollo 13/255-NR-70-892-R19.mov`
- `FR-Masters/Apollo 13/255-NR-70-892-R6.mov`
- `FR-Masters/Apollo 13/255-NR-70-892_R10.mov`
- `FR-Masters/Apollo 13/255-SR-70-151.mov`
- `FR-Masters/Apollo 13/255-VT-60.mov`
- `FR-Masters/Apollo 13/306-SR-104-B.mov`
- `FR-Masters/Apollo 13/342-USAF-39722.mov`
- `FR-Masters/Apollo 13/342-USAF-45280.mov`
- `FR-Masters/Apollo 13/342-USAF-46938_R1.mov`
- `FR-Masters/Apollo 13/342-USAF-50151-R3.mov`
- `FR-Masters/Apollo 13/342-USAF-50151_R1.mov`
- `FR-Masters/Apollo 13/342-USAF-50151_R2.mov`
- `FR-Masters/Apollo 13/342-USAF-50151_R4.mov`
- `FR-Masters/Apollo 13/342-USAF-50906.mov`
- `FR-Masters/Apollo 13/428-NPC-43498.mov`
- `FR-Masters/Apollo 13/428-NPC-43499.mov`
- `FR-Masters/Apollo 13/428-NPC-47917.mov`
- `FR-Masters/Apollo 13/517-BBG-29510.mov`
- `FR-Masters/Apollo 13/517-TVSF-42370.mov`
- `FR-Masters/Apollo 13/UN-UN-38-98.mov`
- `FR-Masters/Split Discovery Reels - Masters/001 - Apollo 11 - Film Flight.mov`
- `FR-Masters/Split Discovery Reels - Masters/002 - Apollo 11 - Film Flight.mov`
- `FR-Masters/Split Discovery Reels - Masters/509 - Unknown reel.mov`
- `FR-Masters/Split Discovery Reels - Masters/Gemini 12 - Flight Film.mov`
- `FR-Masters/Split Discovery Reels - Masters/Gemini 9 Flight Film.mov`
- `FR-Masters/Split Discovery Reels - Masters/Gemini 10 - Flight Film.mov`
- `FR-Masters/Split Discovery Reels - Masters/Gemini 12 - Flight Film 2.mov`
- `70mm Panavision Collection/Apollo Marshall Scans/E-67-Box-4_AVC100.mov`
- `70mm Panavision Collection/Apollo Marshall Scans/E-68-Box-4_AVC100.mov`
- `70mm Panavision Collection/Apollo Marshall Scans/E1-67_AVC100.mov`
- `70mm Panavision Collection/Apollo Marshall Scans/E1-68_AVC100.mov`
- `70mm Panavision Collection/Apollo Marshall Scans/E5-67_AVC100.mov`
- `70mm Panavision Collection/Apollo Marshall Scans/E5-68_AVC100.mov`
- `70mm Panavision Collection/Apollo Marshall Scans/HRC-051.mov`
- `70mm Panavision Collection/Apollo Marshall Scans/HRC-052.mov`
- `70mm Panavision Collection/Apollo Marshall Scans/HRC-053.mov`
- `70mm Panavision Collection/Apollo Marshall Scans/HRC-054.mov`
- `70mm Panavision Collection/Apollo Marshall Scans/HRC-055.mov`
- `70mm Panavision Collection/Apollo Marshall Scans/HRC-057.mov`
- `70mm Panavision Collection/Apollo Marshall Scans/HRC-058.mov`
- `70mm Panavision Collection/Apollo Marshall Scans/HRC-086.mov`
- `70mm Panavision Collection/Apollo Marshall Scans/HRC-112.mov`
- `70mm Panavision Collection/Apollo Marshall Scans/HRC-138.mov`
- `70mm Panavision Collection/Apollo Marshall Scans/HRC-248.mov`
- `70mm Panavision Collection/Apollo Marshall Scans/HRC-260.mov`
- `70mm Panavision Collection/Apollo Marshall Scans/HRC-319.mov`
- `70mm Panavision Collection/Apollo Marshall Scans/KS-70-50311_AVC100.mov`
- `70mm Panavision Collection/Apollo Marshall Scans/KS-70-50320_AVC100.mov`
- `70mm Panavision Collection/Apollo Marshall Scans/KS-70-50321_AVC100.mov`
- `70mm Panavision Collection/Apollo Marshall Scans/KS-70-50336_AVC100.mov`
- `70mm Panavision Collection/Apollo Marshall Scans/KS-73-73660_AVC100.mov`
- `70mm Panavision Collection/Apollo Marshall Scans/KS-73-73679_AVC100.mov`
- `70mm Panavision Collection/Apollo Marshall Scans/KS-73-73683_AVC100.mov`
- `70mm Panavision Collection/Apollo Marshall Scans/KS-73-73685_AVC100.mov`
- `70mm Panavision Collection/Apollo Marshall Scans/MISC-148_AVC100.mov`
- `70mm Panavision Collection/Apollo Marshall Scans/MISC-149_AVC100.mov`
