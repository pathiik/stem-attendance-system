import { Text, View, ActivityIndicator } from "react-native";
import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../FirebaseConfig";

export default function Index() {
  const [parentName, setParentName] = useState<string | null>(null);
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Checking if the user is already logged in
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // If user is logged in, fetch parent details and children
        const parentEmail = user.email;
        if (parentEmail) {
          try {
            // Fetching parent details
            const parentDocRef = doc(db, "parents", parentEmail);
            const parentDocSnap = await getDoc(parentDocRef);

            if (parentDocSnap.exists()) {
              const parentData = parentDocSnap.data();
              console.log("Parent Data:", parentData);

              setParentName(parentData.parent_name || "Parent");

              // Fetching children from the parent database
              if (parentData.children && Array.isArray(parentData.children)) {
                console.log("Children Data:", parentData.children);
                setChildren(parentData.children);
              } else {
                console.error("Children field is missing or not an array.");
              }
            } else {
              console.error("Parent document not found.");
            }
          } catch (error) {
            console.error("Error fetching parent or children data:", error);
          }
        }
      } else {
        // If user is not logged in, redirects to AuthScreen
        router.replace("/screens/AuthScreen");
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup subscription
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View className="mt-5 flex justify-center items-center">
      {parentName ? (
        <>
          <Text className="text-4xl">Hello {parentName}!</Text>
          <Text className="text-xl mt-4">Your Children:</Text>
          {children.length > 0 ? (
            children.map((child, index) => (
              <View key={index} className="mt-2">
                <Text>Name: {child.name}</Text>
                <Text>Student ID: {child.student_id}</Text>
              </View>
            ))
          ) : (
            <Text className="text-lg mt-2">No children found.</Text>
          )}
        </>
      ) : (
        <Text className="text-4xl">HELLO WORLD!</Text>
      )}
      <Link href={{ pathname: "./screens/AuthScreen" }} className="mt-4 text-blue-500">
        Logout
      </Link>
    </View>
  );
}