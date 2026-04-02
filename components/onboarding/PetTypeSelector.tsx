
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PawPrint, CheckCircle2, Search } from 'lucide-react';
import Image from 'next/image';

export const PET_TYPES = [
    { id: 'dog', name: 'Dog', icon: 'https://plus.unsplash.com/premium_photo-1666777247416-ee7a95235559?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8RG9nfGVufDB8fHx8MTc3MzM2MjIxMnww&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 'cat', name: 'Cat', icon: 'https://plus.unsplash.com/premium_photo-1667030474693-6d0632f97029?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8Q2F0fGVufDB8fHx8MTc3MzM2MjIxM3ww&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 'rabbit', name: 'Rabbit', icon: 'https://plus.unsplash.com/premium_photo-1661832480567-68a86cb46f34?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8UmFiYml0fGVufDB8fHx8MTc3MzM2MjIxM3ww&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 'hamster', name: 'Hamster', icon: 'https://plus.unsplash.com/premium_photo-1723541849330-cab9c6ed74d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8SGFtc3RlcnxlbnwwfHx8fDE3NzMzNjIyMTR8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 'lizard', name: 'Lizard', icon: 'https://plus.unsplash.com/premium_photo-1722934582362-0b8669461b02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8TGl6YXJkfGVufDB8fHx8MTc3MzM2MjIxNHww&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 'bird', name: 'Bird', icon: 'https://plus.unsplash.com/premium_photo-1675714692342-01dfd2e6b6b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8QmlyZHxlbnwwfHx8fDE3NzMzNjIyMTV8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 'guinea_pig', name: 'Guinea Pig', icon: 'https://plus.unsplash.com/premium_photo-1664300277972-b9a0db2e1b2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8R3VpbmVhJTIwUGlnfGVufDB8fHx8MTc3MzM2MjIxNXww&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 'ferret', name: 'Ferret', icon: 'https://plus.unsplash.com/premium_photo-1710751040695-d673cec55e6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8RmVycmV0fGVufDB8fHx8MTc3MzM2MjIxNnww&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 'turtle', name: 'Turtle', icon: 'https://plus.unsplash.com/premium_photo-1675432656807-216d786dd468?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8VHVydGxlfGVufDB8fHx8MTc3MzM2MjIxNnww&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 'fish', name: 'Fish', icon: 'https://plus.unsplash.com/premium_photo-1661936371108-6765cb65b4d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8RmlzaHxlbnwwfHx8fDE3NzMzNjIyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 'hedgehog', name: 'Hedgehog', icon: 'https://plus.unsplash.com/premium_photo-1723874396899-681323b389e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8SGVkZ2Vob2d8ZW58MHx8fHwxNzczMzYyMjE3fDA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 'sugar_glider', name: 'Sugar Glider', icon: 'https://plus.unsplash.com/premium_photo-1682308207781-c8fd12dec8f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8U3VnYXIlMjBHbGlkZXJ8ZW58MHx8fHwxNzczMzYyMjE3fDA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 'snake', name: 'Snake', icon: 'https://plus.unsplash.com/premium_photo-1661897154120-5b27cd6a0bd5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8U25ha2V8ZW58MHx8fHwxNzczMzYyMjE4fDA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 'chinchilla', name: 'Chinchilla', icon: 'https://plus.unsplash.com/premium_photo-1673263587755-ddf48724c114?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8Q2hpbmNoaWxsYXxlbnwwfHx8fDE3NzMzNjIyMTh8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 'mouse', name: 'Mouse', icon: 'https://plus.unsplash.com/premium_photo-1664304951108-c04911c42fbd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8cGV0JTIwbWljZSUyMGFuaW1hbHxlbnwwfHx8fDE3NzMzNjI1NDN8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 'hermit_crab', name: 'Hermit Crab', icon: 'https://plus.unsplash.com/premium_photo-1667864262393-b5319164c302?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8SGVybWl0JTIwQ3JhYnxlbnwwfHx8fDE3NzMzNjIyMTl8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 'horse', name: 'Horse', icon: 'https://plus.unsplash.com/premium_photo-1661886008804-9e5b219fc587?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8SG9yc2V8ZW58MHx8fHwxNzczMzYyMjIwfDA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 'goat', name: 'Goat', icon: 'https://plus.unsplash.com/premium_photo-1664304299664-a8e2e2f80290?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8R29hdHxlbnwwfHx8fDE3NzMzNjIyMjB8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 'bearded_dragon', name: 'Bearded Dragon', icon: 'https://plus.unsplash.com/premium_photo-1661964283766-467aeeea9fd0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8QmVhcmRlZCUyMERyYWdvbnxlbnwwfHx8fDE3NzMzNjIyMjF8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 'butterfly', name: 'Butterfly', icon: 'https://plus.unsplash.com/premium_photo-1710462716386-08fe07bb3c61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8QnV0dGVyZmx5fGVufDB8fHx8MTc3MzM2MjIyMnww&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 'arctic_fox', name: 'Arctic Fox', icon: 'https://plus.unsplash.com/premium_photo-1663013313360-974bb910995f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8QXJjdGljJTIwRm94fGVufDB8fHx8MTc3MzM2MjIyMnww&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 'teacup_pig', name: 'Teacup Pig', icon: 'https://plus.unsplash.com/premium_photo-1689245691784-0e40a10d45fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8VGVhY3VwJTIwUGlnfGVufDB8fHx8MTc3MzM2MjIyM3ww&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 'fennec_fox', name: 'Fennec Fox', icon: 'https://plus.unsplash.com/premium_photo-1661963423747-686b37c59aea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8RmVubmVjJTIwRm94fGVufDB8fHx8MTc3MzM2MjIyNHww&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 'tortoise', name: 'Tortoise', icon: 'https://plus.unsplash.com/premium_photo-1724311824020-d5aa35632c81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8VG9ydG9pc2V8ZW58MHx8fHwxNzczMzYyMjI1fDA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 'gerbil', name: 'Gerbil', icon: 'https://plus.unsplash.com/premium_photo-1700028097815-d42c0267bcae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8R2VyYmlsfGVufDB8fHx8MTc3MzM2MjIyNXww&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 'chicken', name: 'Chicken', icon: 'https://plus.unsplash.com/premium_photo-1669742928112-19364a33b530?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8Q2hpY2tlbnxlbnwwfHx8fDE3NzMzNjIyMjZ8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 'chimpanzee', name: 'Chimpanzee', icon: 'https://plus.unsplash.com/premium_photo-1661844659087-1386ef4482da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8Q2hpbXBhbnplZXxlbnwwfHx8fDE3NzMzNjIyMjd8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 'pig', name: 'Pig', icon: 'https://plus.unsplash.com/premium_photo-1661963984016-a541beeb3e0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8UGlnfGVufDB8fHx8MTc3MzM2MjIyN3ww&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 'monkey', name: 'Monkey', icon: 'https://plus.unsplash.com/premium_photo-1664299631876-f143dc691c4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8TW9ua2V5fGVufDB8fHx8MTc3MzM2MjIyOHww&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 'capybara', name: 'Capybara', icon: 'https://plus.unsplash.com/premium_photo-1667873584030-ad34ab3f0f0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8Q2FweWJhcmF8ZW58MHx8fHwxNzczMzYyMjI5fDA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 'snail', name: 'Snail', icon: 'https://plus.unsplash.com/premium_photo-1673376312528-1de29f4bfeb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8U25haWx8ZW58MHx8fHwxNzczMzYyMjI5fDA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 'degu', name: 'Degu', icon: 'https://images.unsplash.com/photo-1721469528770-3e2907ceb1a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8RGVndXxlbnwwfHx8fDE3NzMzNjIyMzB8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 'bee', name: 'Bee', icon: 'https://plus.unsplash.com/premium_photo-1661817353669-055b00b07cf3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8QmVlfGVufDB8fHx8MTc3MzM2MjIzMXww&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 'starfish', name: 'Starfish', icon: 'https://plus.unsplash.com/premium_photo-1693932440279-50a3466eac5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8U3RhcmZpc2h8ZW58MHx8fHwxNzczMzYyMjMxfDA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 'scorpion', name: 'Scorpion', icon: 'https://plus.unsplash.com/premium_photo-1695940750396-399d617b844f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8U2NvcnBpb258ZW58MHx8fHwxNzczMzYyMjMyfDA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 'turkey', name: 'Turkey', icon: 'https://plus.unsplash.com/premium_photo-1661963652315-d5a9d26637dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8VHVya2V5fGVufDB8fHx8MTc3MzM2MjIzMnww&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 'gecko', name: 'Gecko', icon: 'https://plus.unsplash.com/premium_photo-1664303201259-e1cd43e0eb85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8R2Vja298ZW58MHx8fHwxNzczMzYyMjMzfDA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 'red_fox', name: 'Red Fox', icon: 'https://plus.unsplash.com/premium_photo-1669310458041-b65814d270e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8UmVkJTIwRm94fGVufDB8fHx8MTc3MzM2MjIzM3ww&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 'polar_bear', name: 'Polar Bear', icon: 'https://plus.unsplash.com/premium_photo-1661867529492-4941c875b6c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8UG9sYXIlMjBCZWFyfGVufDB8fHx8MTc3MzM2MjIzNHww&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 'frog', name: 'Frog', icon: 'https://plus.unsplash.com/premium_photo-1687440755822-d857a3aaadd4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8RnJvZ3xlbnwwfHx8fDE3NzMzNjIyMzR8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 'owl', name: 'Owl', icon: 'https://plus.unsplash.com/premium_photo-1664304409780-6d31241e9058?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8T3dsfGVufDB8fHx8MTc3MzM2MjIzNXww&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 'budgie', name: 'Budgie', icon: 'https://plus.unsplash.com/premium_photo-1664391649430-d05a4384f0c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8QnVkZ2llfGVufDB8fHx8MTc3MzM2MjIzNnww&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 'wolf', name: 'Wolf', icon: 'https://plus.unsplash.com/premium_photo-1673728218157-b316914d636c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8V29sZnxlbnwwfHx8fDE3NzMzNjIyMzZ8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 'prairie_dog', name: 'Prairie Dog', icon: 'https://plus.unsplash.com/premium_photo-1661854268523-fdc9147b0e77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8UHJhaXJpZSUyMERvZ3xlbnwwfHx8fDE3NzMzNjIyMzd8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 'serval', name: 'Serval', icon: 'https://plus.unsplash.com/premium_photo-1664304265428-eb499ac7ac71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8U2VydmFsfGVufDB8fHx8MTc3MzM2MjIzN3ww&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 'duck', name: 'Duck', icon: 'https://plus.unsplash.com/premium_photo-1670590820850-9e6d6a9a111b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8RHVja3xlbnwwfHx8fDE3NzMzNjIyMzh8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 'zebra', name: 'Zebra', icon: 'https://plus.unsplash.com/premium_photo-1664302719391-9653797f0898?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8WmVicmF8ZW58MHx8fHwxNzczMzYyMjM5fDA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 'salamander', name: 'Salamander', icon: 'https://plus.unsplash.com/premium_photo-1664303201259-e1cd43e0eb85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8U2FsYW1hbmRlcnxlbnwwfHx8fDE3NzMzNjIyNDB8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 'squirrel', name: 'Squirrel', icon: 'https://plus.unsplash.com/premium_photo-1668420973617-5483415585b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8U3F1aXJyZWx8ZW58MHx8fHwxNzczMzYyMjQwfDA&ixlib=rb-4.1.0&q=80&w=1080' },

];

interface Props {
    selected: string;
    onSelect: (type: string) => void;
}

export function PetTypeSelector({ selected, onSelect }: Props) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPets = searchTerm.trim() === ''
        ? PET_TYPES.slice(0, 4)
        : PET_TYPES.filter(pet =>
            pet.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

    return (
        <div className="flex flex-col h-full">
            <h2 className="text-4xl font-bold tracking-tight mb-2 shrink-0">Select Your Companion</h2>
            <p className="text-muted-foreground mb-6 text-lg shrink-0">Every journey begins with a first friend. Who will it be?</p>

            <div className="relative mb-6 shrink-0">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Search for a pet..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 rounded-2xl border-2 focus-visible:ring-0 focus-visible:border-primary transition-colors text-base bg-card/50"
                />
            </div>

            {filteredPets.length === 0 ? (
                <div className="text-center py-12 px-4 border-2 border-dashed rounded-3xl bg-muted/10 flex-1 flex flex-col items-center justify-center">
                    <PawPrint className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-lg font-bold text-foreground">No pets found</p>
                    <p className="text-muted-foreground">Try a different search term.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 overflow-y-auto pr-2 pb-4 scrollbar-hide max-h-[50vh]">
                    {filteredPets.map((type) => (
                    <Card
                        key={type.id}
                        onClick={() => onSelect(type.id)}
                        className={`group cursor-pointer p-0 overflow-hidden relative border-2 transition-all duration-300 rounded-3xl aspect-square ${selected === type.id
                            ? 'border-primary ring-4 ring-primary/10 scale-[1.02]'
                            : 'border-border/50 hover:border-primary/30 hover:shadow-xl'
                            }`}
                    >
                        <div className="w-full h-full relative flex items-center justify-center p-4">
                            <Image
                                src={type.icon}
                                alt={type.name}
                                fill
                                className={`object-cover transition-transform duration-500 ${selected === type.id ? 'scale-110' : 'group-hover:scale-105'}`}
                            />
                            <div className={`absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-60 transition-opacity ${selected === type.id ? 'opacity-90' : 'group-hover:opacity-70'}`} />

                            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                                <span className="text-white font-bold text-lg">{type.name}</span>
                                {selected === type.id && (
                                    <CheckCircle2 className="w-5 h-5 text-primary fill-primary-foreground rounded-full" />
                                )}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
            )}
        </div>
    );
}