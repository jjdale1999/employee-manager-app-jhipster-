package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Salary;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Salary entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SalaryRepository extends JpaRepository<Salary, Long> {}
