# Discovery Tape Deletion Audit

Audit of which Discovery compilation tapes in `O:/Master 1..4` are now fully replaced by individual film-roll master files anywhere else on `/o/`.

## Scan roots

- `O:/FR-Masters` (recursive)
- `O:/70mm Panavision Collection` (recursive)

Excluded from the scan: any path containing `mpeg-proxies`, `mpeg_proxies`, `_premiere`, `_unused_scripts`, `_samples`, `proxy`, `proxies` (proxies and the Discovery-tape Master 1..4 folders themselves).

## Summary

- Total Discovery tapes catalogued: **291**
- **Already removed (file no longer on disk):** 149
- **Safe to delete:** 0
- **Keep (incomplete coverage or unknown content):** 142
- Distinct film-roll identifiers extracted from master filenames: 2337
- Master files whose name could not be parsed to an archive ID: 65 (listed at end)

## Methodology

For each Discovery tape, the script computes the set of *expected* film rolls from two sources:

1. `discovery_shotlist.identifier` — the per-shotlist-row identifier column (authoritative when present).
2. `transfers` rows of type `discovery_capture` — these already include FR numbers mined from the free-text `shotlist_raw` column by the ingest pipeline.

It then checks whether every expected roll has a matching master file anywhere in the scan roots above. `Film` is treated as an alias for `FR`. FR numbers are matched with both 3- and 4-digit zero-padding (canonical: `FR-0748`). A tape is marked **safe to delete** only when every expected roll has a master file on disk AND the tape has no blank/unparseable shotlist rows that would imply unknown content was on that tape.

## 🗑️ Already Removed

These tape files are no longer present at their expected path on `O:/Master 1..4` — they have already been moved or deleted. Their roll coverage is shown for reference.

| Tape | Folder | Rolls covered |
|-----:|:-------|-------------:|
| 507 | Master 1 | 0 |
| 512 | Master 1 | 9 |
| 513 | Master 1 | 8 |
| 537 | Master 1 | 7 |
| 541 | Master 1 | 8 |
| 542 | Master 1 | 5 |
| 544 | Master 1 | 9 |
| 545 | Master 1 | 9 |
| 546 | Master 1 | 2 |
| 547 | Master 1 | 3 |
| 561 | Master 1 | 6 |
| 565 | Master 2 | 5 |
| 566 | Master 2 | 6 |
| 569 | Master 2 | 7 |
| 570 | Master 2 | 5 |
| 571 | Master 2 | 5 |
| 573 | Master 2 | 8 |
| 574 | Master 2 | 11 |
| 575 | Master 2 | 6 |
| 577 | Master 2 | 1 |
| 580 | Master 2 | 3 |
| 581 | Master 2 | 4 |
| 582 | Master 2 | 3 |
| 583 | Master 2 | 3 |
| 584 | Master 2 | 6 |
| 585 | Master 2 | 6 |
| 586 | Master 2 | 6 |
| 587 | Master 2 | 6 |
| 588 | Master 2 | 5 |
| 605 | Master 2 | 7 |
| 607 | Master 2 | 7 |
| 609 | Master 2 | 7 |
| 617 | Master 2 | 1 |
| 620 | Master 2 | 6 |
| 621 | Master 2 | 5 |
| 623 | Master 2 | 7 |
| 624 | Master 2 | 5 |
| 625 | Master 2 | 5 |
| 626 | Master 3 | 5 |
| 629 | Master 3 | 3 |
| 642 | Master 3 | 1 |
| 648 | Master 3 | 0 |
| 649 | Master 3 | 0 |
| 650 | Master 3 | 6 |
| 651 | Master 3 | 5 |
| 652 | Master 3 | 6 |
| 653 | Master 3 | 7 |
| 655 | Master 3 | 5 |
| 656 | Master 3 | 5 |
| 657 | Master 3 | 4 |
| 658 | Master 3 | 5 |
| 659 | Master 3 | 1 |
| 660 | Master 3 | 6 |
| 661 | Master 3 | 4 |
| 662 | Master 3 | 2 |
| 664 | Master 3 | 6 |
| 665 | Master 3 | 5 |
| 667 | Master 3 | 5 |
| 671 | Master 3 | 5 |
| 672 | Master 3 | 8 |
| 673 | Master 3 | 5 |
| 674 | Master 3 | 9 |
| 677 | Master 3 | 5 |
| 678 | Master 3 | 6 |
| 684 | Master 3 | 0 |
| 685 | Master 3 | 7 |
| 686 | Master 3 | 3 |
| 687 | Master 3 | 6 |
| 688 | Master 3 | 5 |
| 689 | Master 3 | 3 |
| 691 | Master 3 | 2 |
| 692 | Master 3 | 0 |
| 693 | Master 3 | 0 |
| 709 | Master 3 | 0 |
| 713 | Master 4 | 0 |
| 714 | Master 4 | 0 |
| 715 | Master 4 | 0 |
| 716 | Master 4 | 0 |
| 717 | Master 4 | 0 |
| 718 | Master 4 | 0 |
| 719 | Master 4 | 0 |
| 720 | Master 4 | 0 |
| 721 | Master 4 | 0 |
| 722 | Master 4 | 0 |
| 723 | Master 4 | 0 |
| 726 | Master 4 | 0 |
| 727 | Master 4 | 0 |
| 728 | Master 4 | 0 |
| 729 | Master 4 | 0 |
| 731 | Master 4 | 0 |
| 744 | Master 4 | 0 |
| 747 | Master 4 | 0 |
| 748 | Master 4 | 0 |
| 754 | Master 4 | 0 |
| 755 | Master 4 | 1 |
| 756 | Master 4 | 0 |
| 757 | Master 4 | 0 |
| 758 | Master 4 | 0 |
| 759 | Master 4 | 0 |
| 762 | Master 4 | 0 |
| 763 | Master 4 | 0 |
| 780 | Master 4 | 0 |
| 781 | Master 4 | 0 |
| 782 | Master 4 | 0 |
| 783 | Master 4 | 0 |
| 786 | Master 4 | 0 |
| 787 | Master 4 | 0 |
| 794 | Master 4 | 0 |
| 797 | Master 4 | 0 |
| 799 | Master 4 | 0 |
| 800 | Master 4 | 0 |
| 801 | Master 4 | 0 |
| 802 | Master 4 | 0 |
| 806 | Master 4 | 0 |
| 808 | Master 4 | 0 |
| 813 | Master 4 | 0 |
| 814 | Master 4 | 0 |
| 816 | Master 4 | 0 |
| 817 | Master 4 | 0 |
| 818 | Master 4 | 0 |
| 828 | Master 4 | 0 |
| 832 | Master 4 | 0 |
| 833 | Master 4 | 0 |
| 835 | Master 4 | 0 |
| 837 | Master 4 | 0 |
| 839 | Master 4 | 0 |
| 840 | Master 4 | 0 |
| 845 | Master 4 | 0 |
| 847 | Master 4 | 0 |
| 850 | Master 4 | 0 |
| 859 | Master 4 | 0 |
| 860 | Master 4 | 0 |
| 861 | Master 4 | 0 |
| 862 | Master 4 | 0 |
| 864 | Master 4 | 0 |
| 867 | Master 4 | 0 |
| 873 | Master 4 | 0 |
| 874 | Master 4 | 0 |
| 875 | Master 4 | 0 |
| 876 | Master 4 | 0 |
| 877 | Master 4 | 0 |
| 878 | Master 4 | 0 |
| 879 | Master 4 | 0 |
| 880 | Master 4 | 0 |
| 882 | Master 4 | 0 |
| 883 | Master 4 | 0 |
| 884 | Master 4 | 0 |
| 885 | Master 4 | 0 |
| 886 | Master 4 | 0 |

## ✅ Safe to Delete

_None._

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
| 538 | Master 1 | 6 | 5 | 1 | 1 expected roll(s) have no master file on disk; 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 539 | Master 1 | 2 | 1 | 1 | 1 expected roll(s) have no master file on disk; 3 non-archive identifier(s) on this tape (e.g. 158.4, 173.1, 173.2) |
| 540 | Master 1 | 4 | 4 | 0 | 1 non-archive identifier(s) on this tape (e.g. 306.2) |
| 543 | Master 1 | 5 | 4 | 1 | 1 expected roll(s) have no master file on disk; 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
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
| 572 | Master 2 | 7 | 6 | 1 | 1 expected roll(s) have no master file on disk |
| 576 | Master 2 | 4 | 4 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 578 | Master 2 | 5 | 0 | 5 | 5 expected roll(s) have no master file on disk; 1 non-archive identifier(s) on this tape (e.g. HQA 200) |
| 579 | Master 2 | 8 | 0 | 8 | 8 expected roll(s) have no master file on disk |
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
| 622 | Master 2 | 6 | 4 | 2 | 2 expected roll(s) have no master file on disk |
| 627 | Master 3 | 4 | 1 | 3 | 3 expected roll(s) have no master file on disk; 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 628 | Master 3 | 8 | 8 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
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
| 654 | Master 3 | 5 | 4 | 1 | 1 expected roll(s) have no master file on disk |
| 663 | Master 3 | 5 | 5 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 668 | Master 3 | 3 | 3 | 0 | 6 non-archive identifier(s) on this tape (e.g. 803016, 803101, 803104) |
| 669 | Master 3 | 2 | 2 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content); 3 non-archive identifier(s) on this tape (e.g. 803204, 803217, 803254) |
| 670 | Master 3 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 679 | Master 3 | 2 | 0 | 2 | 2 expected roll(s) have no master file on disk |
| 680 | Master 3 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 681 | Master 3 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 682 | Master 3 | 1 | 0 | 1 | 1 expected roll(s) have no master file on disk |
| 683 | Master 3 | 0 | 0 | 0 | 4 non-archive identifier(s) on this tape (e.g. MSFC E-16, MSFC E-72, MSFC E-77) |
| 690 | Master 3 | 0 | 0 | 0 | 1 non-archive identifier(s) on this tape (e.g. 803205) |
| 700 | Master 3 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 701 | Master 3 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 703 | Master 3 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 704 | Master 3 | 3 | 0 | 3 | 3 expected roll(s) have no master file on disk |
| 705 | Master 3 | 3 | 0 | 3 | 3 expected roll(s) have no master file on disk; 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 706 | Master 3 | 2 | 0 | 2 | 2 expected roll(s) have no master file on disk |
| 707 | Master 3 | 2 | 0 | 2 | 2 expected roll(s) have no master file on disk |
| 708 | Master 3 | 0 | 0 | 0 | 1 non-archive identifier(s) on this tape (e.g. 718918) |
| 724 | Master 4 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 725 | Master 4 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 760 | Master 4 | 0 | 0 | 0 | 1 non-archive identifier(s) on this tape (e.g. 720301) |
| 761 | Master 4 | 0 | 0 | 0 | 1 non-archive identifier(s) on this tape (e.g. 720069) |
| 764 | Master 4 | 1 | 0 | 1 | 1 expected roll(s) have no master file on disk |
| 765 | Master 4 | 1 | 0 | 1 | 1 expected roll(s) have no master file on disk |
| 766 | Master 4 | 1 | 0 | 1 | 1 expected roll(s) have no master file on disk |
| 767 | Master 4 | 1 | 0 | 1 | 1 expected roll(s) have no master file on disk |
| 788 | Master 4 | 1 | 0 | 1 | 1 expected roll(s) have no master file on disk |
| 789 | Master 4 | 1 | 0 | 1 | 1 expected roll(s) have no master file on disk |
| 790 | Master 4 | 1 | 0 | 1 | 1 expected roll(s) have no master file on disk |
| 791 | Master 4 | 1 | 0 | 1 | 1 expected roll(s) have no master file on disk |
| 792 | Master 4 | 1 | 0 | 1 | 1 expected roll(s) have no master file on disk |
| 793 | Master 4 | 1 | 0 | 1 | 1 expected roll(s) have no master file on disk |
| 795 | Master 4 | 0 | 0 | 0 | 5 non-archive identifier(s) on this tape (e.g. 715916, 715953, 715966) |
| 796 | Master 4 | 0 | 0 | 0 | 1 non-archive identifier(s) on this tape (e.g. 734456) |
| 798 | Master 4 | 0 | 0 | 0 | 1 non-archive identifier(s) on this tape (e.g. 734459) |
| 803 | Master 4 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 804 | Master 4 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 805 | Master 4 | 0 | 0 | 0 | 1 shotlist row(s) on this tape have a blank identifier (unknown content) |
| 809 | Master 4 | 0 | 0 | 0 | 5 non-archive identifier(s) on this tape (e.g. 117687, 117752, 117761) |
| 810 | Master 4 | 0 | 0 | 0 | 1 non-archive identifier(s) on this tape (e.g. 117712) |
| 815 | Master 4 | 1 | 0 | 1 | 1 expected roll(s) have no master file on disk |
| 819 | Master 4 | 1 | 0 | 1 | 1 expected roll(s) have no master file on disk; 1 non-archive identifier(s) on this tape (e.g. JSC1374D) |
| 823 | Master 4 | 1 | 0 | 1 | 1 expected roll(s) have no master file on disk |

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

#### Tape 654 — `Master 3/Tape 654 - Self Contained.mov`

- Expected rolls: **5**, on disk: **4**, missing: **1**
- Missing rolls (1):
  - `JSC-346`

#### Tape 663 — `Master 3/Tape 663 - Self Contained.mov`

- Expected rolls: **5**, on disk: **5**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 668 — `Master 3/Tape 668 - Self Contained.mov`

- Expected rolls: **3**, on disk: **3**, missing: **0**
- Non-archive identifiers on this tape: `803016`, `803101`, `803104`, `803105`, `803115`, `803125`

#### Tape 669 — `Master 3/Tape 669 - Self Contained.mov`

- Expected rolls: **2**, on disk: **2**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)
- Non-archive identifiers on this tape: `803204`, `803217`, `803254`

#### Tape 670 — `Master 3/Tape 670 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

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

#### Tape 690 — `Master 3/Tape 690 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Non-archive identifiers on this tape: `803205`

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

#### Tape 724 — `Master 4/Tape 724 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 725 — `Master 4/Tape 725 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 760 — `Master 4/Tape 760 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Non-archive identifiers on this tape: `720301`

#### Tape 761 — `Master 4/Tape 761 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Non-archive identifiers on this tape: `720069`

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

#### Tape 795 — `Master 4/Tape 795 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Non-archive identifiers on this tape: `715916`, `715953`, `715966`, `718356`, `718904`

#### Tape 796 — `Master 4/Tape 796 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Non-archive identifiers on this tape: `734456`

#### Tape 798 — `Master 4/Tape 798 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Non-archive identifiers on this tape: `734459`

#### Tape 803 — `Master 4/Tape 803 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 804 — `Master 4/Tape 804 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 805 — `Master 4/Tape 805 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Shotlist rows with blank identifier: 1 (unknown content on this tape)

#### Tape 809 — `Master 4/Tape 809 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Non-archive identifiers on this tape: `117687`, `117752`, `117761`, `117780`, `117784`

#### Tape 810 — `Master 4/Tape 810 - Self Contained.mov`

- Expected rolls: **0**, on disk: **0**, missing: **0**
- Non-archive identifiers on this tape: `117712`

#### Tape 815 — `Master 4/Tape 815 - Self Contained.mov`

- Expected rolls: **1**, on disk: **0**, missing: **1**
- Missing rolls (1):
  - `FR-G90-006`

#### Tape 819 — `Master 4/Tape 819 - Self Contained.mov`

- Expected rolls: **1**, on disk: **0**, missing: **1**
- Missing rolls (1):
  - `JSC1374D`
- Non-archive identifiers on this tape: `JSC1374D`

#### Tape 823 — `Master 4/Tape 823 - Self Contained.mov`

- Expected rolls: **1**, on disk: **0**, missing: **1**
- Missing rolls (1):
  - `JSC-1906`

## Unparseable Master Filenames

These files in the scan roots could not be matched to a film-roll identifier and were not used to satisfy any tape's coverage. Review them manually.

- `FR-Masters/additional_masters_2026-05/GRUMMAN_171-82.mov`
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
