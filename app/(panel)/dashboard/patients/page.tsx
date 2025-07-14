'use client';
import React from "react";
import Link from "next/link";
import { Header } from "@/app/(panel)/dashboard/components/layout/Header";
import { Sidebar } from "@/app/(panel)/dashboard/components/layout/Sidebar";
import { Button } from "@/components/ui/button";

// Dummy data for patients
const patients = [
    {
        id: "1",
        name: "Alice Johnson",
        photo: "/images/patients/alice.jpg",
        calendarUrl: "/dashboard/patients/1/schedule",
        active: true,
    },
    {
        id: "2",
        name: "Bob Smith",
        photo: "/images/patients/bob.jpg",
        calendarUrl: "/dashboard/patients/2/schedule",
        active: true,
    },
    {
        id: "3",
        name: "Carol Lee",
        photo: "/images/patients/carol.jpg",
        calendarUrl: "/dashboard/patients/3/schedule",
        active: true,
    },
    {
        id: "4",
        name: "David Kim",
        photo: "/images/patients/david.jpg",
        calendarUrl: "/dashboard/patients/4/schedule",
        active: true,
    },
    // Add more patients up to 16 for the grid
    {
        id: "5",
        name: "Eve Turner",
        photo: "/images/patients/eve.jpg",
        calendarUrl: "/dashboard/patients/5/schedule",
        active: true,
    },
    {
        id: "6",
        name: "Frank Miller",
        photo: "/images/patients/frank.jpg",
        calendarUrl: "/dashboard/patients/6/schedule",
        active: true,
    },
    {
        id: "7",
        name: "Grace Lee",
        photo: "/images/patients/grace.jpg",
        calendarUrl: "/dashboard/patients/7/schedule",
        active: true,
    },
    {
        id: "8",
        name: "Henry Ford",
        photo: "/images/patients/henry.jpg",
        calendarUrl: "/dashboard/patients/8/schedule",
        active: true,
    },
    {
        id: "9",
        name: "Ivy Chen",
        photo: "/images/patients/ivy.jpg",
        calendarUrl: "/dashboard/patients/9/schedule",
        active: true,
    },
    {
        id: "10",
        name: "Jack Brown",
        photo: "/images/patients/jack.jpg",
        calendarUrl: "/dashboard/patients/10/schedule",
        active: true,
    },
    {
        id: "11",
        name: "Karen White",
        photo: "/images/patients/karen.jpg",
        calendarUrl: "/dashboard/patients/11/schedule",
        active: true,
    },
    {
        id: "12",
        name: "Leo Green",
        photo: "/images/patients/leo.jpg",
        calendarUrl: "/dashboard/patients/12/schedule",
        active: true,
    },
    {
        id: "13",
        name: "Mona Black",
        photo: "/images/patients/mona.jpg",
        calendarUrl: "/dashboard/patients/13/schedule",
        active: true,
    },
    {
        id: "14",
        name: "Nina Blue",
        photo: "/images/patients/nina.jpg",
        calendarUrl: "/dashboard/patients/14/schedule",
        active: true,
    },
    {
        id: "15",
        name: "Oscar Red",
        photo: "/images/patients/oscar.jpg",
        calendarUrl: "/dashboard/patients/15/schedule",
        active: true,
    },
    {
        id: "16",
        name: "Paul Violet",
        photo: "/images/patients/paul.jpg",
        calendarUrl: "/dashboard/patients/16/schedule",
        active: true,
    },
];

const PatientCard: React.FC<{
    patient: typeof patients[0];
    onInactive: (id: string) => void;
}> = ({ patient, onInactive }) => (
    <div className="bg-card rounded-lg shadow p-6 flex flex-col items-center border">
        <img
            src={patient.photo}
            alt={patient.name}
            className="w-20 h-20 rounded-full object-cover mb-3 border"
        />
        <div className="font-semibold text-lg mb-2">{patient.name}</div>
        <Button
            asChild
            className="mb-2 w-full"
            variant="default"
            size="sm"
            disabled={!patient.active}
        >
            <Link href={patient.calendarUrl}>
                Schedule Consult
            </Link>
        </Button>
        <Button
            variant="destructive"
            size="sm"
            className="w-full"
            onClick={() => onInactive(patient.id)}
            disabled={!patient.active}
        >
            {patient.active ? "Inactivate" : "Inactive"}
        </Button>
    </div>
);

export default function PatientsPage() {
    const [patientList, setPatientList] = React.useState(patients);

    const handleInactive = (id: string) => {
        setPatientList((prev) =>
            prev.map((p) =>
                p.id === id ? { ...p, active: false } : p
            )
        );
    };

    // Limit to 8 patients for 4x2 grid
    const visiblePatients = patientList.slice(0, 8);

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
            <Header />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 p-8 overflow-auto">
                    <h1 className="text-2xl font-bold mb-6">Patients</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {visiblePatients.map((patient) => (
                            <PatientCard
                                key={patient.id}
                                patient={patient}
                                onInactive={handleInactive}
                            />
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}